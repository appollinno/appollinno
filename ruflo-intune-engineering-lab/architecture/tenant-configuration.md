# Microsoft Intune — Recommended Tenant Configuration

> **Ruflo Intune Engineering Lab — Agent 1: Senior Microsoft Intune Solution Architect**
> **Document:** `tenant-configuration.md`
> **Primary reference:** [Microsoft Learn — Intune](https://learn.microsoft.com/intune/)
> **Last updated:** 2026-11-21

This document defines the **tenant-level configuration baseline**. It clearly separates 🔶 **Mandatory** (required for the capability to function) from 🔷 **Recommended** (enterprise best practice). ✅ = documented product fact (cited); 🧭 = architectural recommendation by this agent.

> ⚠️ Design artifact only — assumes **no production tenant access**, performs **no tenant modifications**. Values are reference designs to validate in a non-production tenant.

---

## 1. MDM authority

✅ **Verified** — The **MDM authority** determines which service manages devices. For a modern cloud deployment the authority is **Microsoft Intune**. You can confirm it in **Tenant administration → Tenant status → Tenant details** (shows MDM authority, total licensed users, total Intune licenses).
Source: [Intune licensing — confirm your licenses](https://learn.microsoft.com/intune/fundamentals/licensing)

| Item | Setting | Status |
| --- | --- | --- |
| MDM authority | **Intune** | 🔶 Mandatory (modern tenants default to Intune) |
| Co-management (if ConfigMgr present) | Intune authority for chosen workload sliders | 🔷 Recommended for migration scenarios |

🧭 Greenfield tenants are already set to the Intune MDM authority; no action beyond verification. Co-management (ConfigMgr + Intune) is a migration pattern owned jointly by Agent 2 and the on-prem team.

---

## 2. Automatic enrollment (MDM auto-enrollment)

✅ **Verified** — Windows **automatic enrollment** (via Entra ID MDM settings) lets Windows devices enroll into Intune automatically on Entra join / register, and is a prerequisite for Autopilot and co-management auto-enrollment.
Source: [User-driven Entra join: set up Windows automatic Intune enrollment](https://learn.microsoft.com/autopilot/tutorial/user-driven/azure-ad-join-automatic-enrollment)

| Setting | Recommended value | Status |
| --- | --- | --- |
| MDM user scope | **All** (or a pilot group during rollout) | 🔶 Mandatory for Autopilot/auto-enrollment |
| MAM user scope | **All** (for BYOD app protection without enrollment) | 🔷 Recommended |

> ✅ **Verified** — Co-management auto-enrollment of existing ConfigMgr devices requires **Entra ID P1/P2 per user** and **Intune Plan 1** (bundled). Other enrollment scenarios still require assigned Intune licenses.
> Source: [Intune licensing — co-management](https://learn.microsoft.com/intune/fundamentals/licensing)

---

## 3. Enrollment restrictions

✅ **Verified** — Two restriction types exist, each with **one default policy** applied to all enrollments until a higher-priority policy overrides:
1. **Device platform restrictions** — restrict by platform, OS version, manufacturer, or ownership.
2. **Device limit restrictions** — cap the number of devices per user.

> ✅ **Verified — not a security feature:** "Enrollment restrictions are not security features. Compromised devices can misrepresent their character." Treat them as a best-effort barrier for non-malicious users; enforce security with compliance + Conditional Access.
> Source: [What are enrollment restrictions?](https://learn.microsoft.com/intune/device-enrollment/restrictions)

### 3.1 Device platform restrictions

✅ **Verified** — Configurable per platform (Windows, Android DA, Android Enterprise work profile, iOS/iPadOS, macOS, tvOS, visionOS): **Allow/Block** the platform, **Allow/Block personally-owned**, **min/max OS version**, **blocked manufacturers** (Android). Platform restrictions use **assignment filters**; Entra↔Intune assignment propagation typically takes **~15 minutes** (not instant).
Source: [Create device platform restrictions](https://learn.microsoft.com/intune/device-enrollment/create-platform-restrictions) · [What are enrollment restrictions?](https://learn.microsoft.com/intune/device-enrollment/restrictions)

🧭 **Recommended platform baseline:**

| Platform | Allow | Personally-owned | Min OS (🧭 set to your supported floor) |
| --- | --- | --- | --- |
| Windows | ✅ Allow | 🔷 Block for corp-only groups; Allow for BYOD groups | Supported Win10/11 build |
| iOS/iPadOS | ✅ Allow | Allow (BYOD) | Current − 1 major |
| Android Enterprise (work profile) | ✅ Allow | Allow (BYOD) | Current − 1 major |
| Android **device administrator** | 🔶 **Block** | Block | — (deprecated on GMS ✅) |
| macOS | ✅ Allow | Per policy | Current − 1 major |
| Windows Server | **Blocked by default** ✅ | — | — |

> ✅ **Verified** — Android **device administrator** management is deprecated and unavailable on GMS devices. Block DA enrollment.
> Source: [What are enrollment restrictions?](https://learn.microsoft.com/intune/device-enrollment/restrictions)

### 3.2 Device limit restrictions

✅ **Verified facts:**
- The per-user device limit can be set from **1 to 15**.
- You can have up to **25 device limit restriction policies**.
- Device limit restrictions apply to **Android, iOS/iPadOS, macOS, Windows**.
- Creating/editing device limit restrictions requires the **Intune Service Administrator** (Entra) role; other built-in roles are **read-only** for this setting.
- Priority: lowest number wins when a user is in multiple groups (priority **1** is highest). The default policy is always lowest priority.
- Edits apply to **new** enrollments only; already-enrolled devices are unaffected.
- A device enrollment counts toward the cap if it is Intune-managed, has contacted Intune within 90 days, isn't registration-pending >24h, hasn't failed Apple enrollment, and hasn't been deleted.

Sources: [What are enrollment restrictions?](https://learn.microsoft.com/intune/device-enrollment/restrictions) · [Create device limit restrictions](https://learn.microsoft.com/intune/device-enrollment/create-device-limit-restrictions)

🧭 **Recommended device limits:**

| Group | Limit | Rationale |
| --- | --- | --- |
| Standard workforce (BYOD) | **5** | Balances flexibility with hygiene |
| Corporate single-device users | **3** | Lower surface; corp issues the device |
| Executives / power users | **10** | Multiple device form factors |
| Default policy (catch-all) | **5** | Reasonable global default |

> ✅ **Verified** — Hitting the cap raises a `DeviceCapReached` error at enrollment. Avoid caps by removing stale devices (device cleanup rules, §7). Shared/kiosk scenarios should use enrollment models exempt from per-user caps (e.g., Device Enrollment Manager, dedicated devices) rather than raising limits for everyone.
> Source: [Troubleshooting device enrollment — device cap reached](https://learn.microsoft.com/troubleshoot/mem/intune/device-enrollment/troubleshoot-device-enrollment-in-intune)

---

## 4. Platform-specific enrollment prerequisites (connectors & tokens)

🔶 **Mandatory per platform** to enable enrollment at all:

| Platform | Prerequisite | Notes |
| --- | --- | --- |
| Apple (iOS/iPadOS/macOS) | **Apple MDM Push certificate** | Renew annually; loss breaks all Apple management |
| Apple ADE (zero-touch) | **Apple Business Manager + ADE token** | Sync limits apply (✅ §2.5 in main blueprint) |
| Apple VPP (apps) | **VPP/ABM location token(s)** | ✅ VPP apps inherit the token's scope tags |
| Android Enterprise | **Managed Google Play connection** | Required for all AE modes |
| Windows hybrid Autopilot | **Intune Connector for Active Directory** | Needs line-of-sight to a DC |

> 🧭 Ownership: Apple/Google connector setup is implemented by Agent 5 (Identity) / Agent 2 (Windows); Agent 1 mandates their existence as architecture prerequisites.

---

## 5. Device categories

✅ **Verified** — Create device categories (e.g., *Nursing*, *Marketing*) and Intune can **automatically add enrolled devices to the matching device group**. Available on all platforms except Linux.
Source: [Step 5 — Enroll devices: categorize devices into groups](https://learn.microsoft.com/intune/device-enrollment/enroll-devices)

🧭 **Recommended categories** (map to dynamic/assigned groups and scope tags — see RBAC doc):

| Category | Use |
| --- | --- |
| `Corporate-Standard` | Standard corp-issued endpoints |
| `Corporate-Kiosk` | Dedicated/shared devices |
| `BYOD` | Personally-owned |
| `Executive` | Elevated-support population |
| Per-region (`EMEA`, `AMER`, `APAC`) | Geographic delegation |

---

## 6. Enrollment Status Page (ESP)

✅ **Verified facts:**
- The ESP shows provisioning progress during OOBE / Autopilot and can **block device use until required apps and policies install**.
- It uses the `EnrollmentStatusTracking` and `FirstSyncStatus` CSPs.
- You can create a maximum of **51 ESP profiles** (1 Default + 50 custom).
- Autopilot runs a **Device ESP phase** then a **User ESP phase**.

Sources: [Set up the Enrollment Status Page](https://learn.microsoft.com/intune/device-enrollment/windows/setup-status-page) · [Autopilot user-driven Entra join overview](https://learn.microsoft.com/autopilot/tutorial/user-driven/azure-ad-join-workflow)

🧭 **Recommended ESP strategy (Agent 2 implements detail):**

| Setting | Recommended | Rationale |
| --- | --- | --- |
| Show app/profile install progress | **Yes** | Transparency for users |
| Block device use until all apps/profiles installed | **Yes** (scoped to a short list of *critical* apps) | Don't block on the full catalog |
| Allow users to reset on error | 🔷 Yes | Reduces helpdesk tickets |
| Allow use on install failure | 🔷 Conditional | Avoid stranding users |
| Timeout | Set realistically (e.g., 60 min) | Prevent false failures on slow links |
| Block until required apps are installed | List only **blocking** apps | Long lists cause ESP timeouts |

> 🧭 **Anti-pattern:** Forcing the *entire* app catalog through a blocking ESP. Block only on genuinely critical apps (security agent, VPN, management tooling); deliver the rest post-login.

---

## 7. Device cleanup rules

✅ **Verified facts:**
- Cleanup rules run on a schedule and **hide** records of devices that haven't checked in for a set period. They **do not wipe or retire** the device.
- Threshold: **between 30 and 270 days**.
- One rule per platform; if both a platform-specific and an *All platforms* rule exist, the **one with fewer days** applies.
- Hidden devices **reappear** if they check in before their device certificate expires; after expiry, re-enrollment is required.
- Cleanup rules **do not remove** the object from **Microsoft Entra ID** — manage Entra stale devices separately.
- Requires **Intune Administrator** or a custom role with `Managed Device Cleanup Rules/Update` + `Managed Device Cleanup Settings/Update`.
- Not available for **Jamf-managed** devices.

Sources: [Device cleanup rules](https://learn.microsoft.com/intune/governance/configure-cleanup-rules) · [Manage stale devices in Microsoft Entra ID](https://learn.microsoft.com/entra/identity/devices/manage-stale-devices)

🧭 **Recommended cleanup thresholds:**

| Platform | Threshold | Rationale |
| --- | --- | --- |
| Windows / macOS | **90 days** | Standard inactivity window |
| iOS/iPadOS / Android | **60–90 days** | Faster mobile turnover |
| All platforms (fallback) | **90 days** | Catch-all |

> 🔷 **Recommended governance:** Pair Intune cleanup (hides) with a **scheduled Entra stale-device process** (disable → delete) — Agent 6 automates via Microsoft Graph. ⚠️ ✅ Back up **BitLocker recovery keys** before deleting devices — they cannot be recovered afterward.

---

## 8. Corporate vs. personal (BYOD) device management

🧭 **Architectural separation model:**

| Dimension | Corporate | Personal (BYOD) |
| --- | --- | --- |
| Identity model | Entra join / ADE / fully managed | Entra register / work profile / MAM-only |
| Enrollment path | Autopilot / ADE / zero-touch | User-initiated via Company Portal |
| Data protection | Full MDM config + compliance | **App Protection Policies (MAM)** |
| Ownership flag | Marked **Corporate** (corporate identifiers / ADE / enrollment profile) | Marked **Personal** |
| Wipe scope | Full or selective | **Selective (retire)** — personal data preserved |
| Privacy | Full management | Minimized; MAM protects *app data*, not the device |

✅ **Verified** — Corporate ownership is established via **corporate device identifiers**, ADE enrollment, or enrollment profiles; **retire** removes company data without a factory reset (ideal for BYOD), while **wipe** resets to factory.
Source: [Device action: retire](https://learn.microsoft.com/intune/device-management/actions/retire)

> 🔷 **Recommended:** For BYOD, prefer **MAM / App Protection Policies** over full enrollment where possible — it protects corporate data in managed apps with minimal device intrusion, improving adoption and privacy. (Agent 3 + Agent 4 implement.)

---

## 9. Terms & conditions and Company Portal branding

✅ **Verified (Zero Trust tenant hygiene recommendations):**
- **Terms & conditions** policies require users to accept legal/compliance terms before enrollment/access (shown in Company Portal). For sign-in-time terms, consider **Entra Terms of Use**.
- **Company Portal branding** (org name, logo, support contacts) improves trust and reduces support overhead.

Sources: [Configure Intune for Zero Trust — secure tenants](https://learn.microsoft.com/intune/device-security/ref-zero-trust-tenant) · [Terms and conditions](https://learn.microsoft.com/intune/device-enrollment/create-terms-and-conditions)

| Item | Status |
| --- | --- |
| Terms & conditions policy | 🔷 Recommended (🔶 where legally required) |
| Company Portal branding & support info | 🔷 Recommended |
| Require MFA at enrollment (via CA) | 🔶 Mandatory (security) — ✅ requires Entra ID P1/P2 |

---

## 10. Tenant configuration checklist

| # | Setting | Status | Owner |
| --- | --- | --- | --- |
| 1 | MDM authority = Intune (verify) | 🔶 | Agent 1 |
| 2 | Windows automatic enrollment (MDM scope) | 🔶 | Agent 5/2 |
| 3 | MAM user scope for BYOD | 🔷 | Agent 3 |
| 4 | Platform restrictions (block Android DA, Windows Server default) | 🔶/🔷 | Agent 1/2 |
| 5 | Device limit restrictions (per-group, 1–15) | 🔷 | Agent 1 |
| 6 | Apple MDM Push cert + ADE/VPP tokens | 🔶 | Agent 5 |
| 7 | Managed Google Play connection | 🔶 | Agent 5/2 |
| 8 | Device categories → groups | 🔷 | Agent 1/5 |
| 9 | ESP profile(s) with critical-app blocking | 🔷 | Agent 2 |
| 10 | Device cleanup rules (30–270 days) | 🔷 | Agent 2/6 |
| 11 | "No compliance policy = noncompliant" | 🔶 | Agent 4 |
| 12 | Terms & conditions + Company Portal branding | 🔷 | Agent 1/3 |
| 13 | Require MFA at enrollment (CA) | 🔶 | Agent 5 |

---

## 11. References

- [What are enrollment restrictions?](https://learn.microsoft.com/intune/device-enrollment/restrictions)
- [Create device platform restrictions](https://learn.microsoft.com/intune/device-enrollment/create-platform-restrictions)
- [Create device limit restrictions](https://learn.microsoft.com/intune/device-enrollment/create-device-limit-restrictions)
- [Set up the Enrollment Status Page](https://learn.microsoft.com/intune/device-enrollment/windows/setup-status-page)
- [Device cleanup rules](https://learn.microsoft.com/intune/governance/configure-cleanup-rules)
- [Intune licensing](https://learn.microsoft.com/intune/fundamentals/licensing)
- [Configure Intune for Zero Trust — secure tenants](https://learn.microsoft.com/intune/device-security/ref-zero-trust-tenant)
- [Manage Apple mobile devices and tokens for ADE](https://learn.microsoft.com/intune/device-enrollment/apple/manage-devices-tokens-apple)

---

*Prepared by Agent 1 for the Ruflo orchestrator. Submitted for QA review (Agent 8).*
