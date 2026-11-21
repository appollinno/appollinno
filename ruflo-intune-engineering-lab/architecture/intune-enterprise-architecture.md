# Microsoft Intune Enterprise Architecture Blueprint

> **Ruflo Intune Engineering Lab — Agent 1: Senior Microsoft Intune Solution Architect**
> **Document:** `intune-enterprise-architecture.md`
> **Status:** Architecture baseline — submitted for QA review (Agent 8)
> **Primary reference:** [Microsoft Learn — Intune documentation](https://learn.microsoft.com/intune/)
> **Last updated:** 2026-11-21

---

## 0. How to read this blueprint

This document is the **architectural foundation** for the Ruflo Intune Engineering Lab. It defines *what* the environment looks like and *why*. Implementation detail (step-by-step configuration, scripts, specific policy values) is delegated to Agents 2–7 — see [`architecture-decisions.md`](./architecture-decisions.md) §Collaboration.

Throughout this blueprint two labels are used:

| Label | Meaning |
| --- | --- |
| ✅ **Verified** | A documented product behaviour or requirement, cited to Microsoft Learn. |
| 🧭 **Recommendation** | An architectural opinion/design choice made by this agent. Valid, but tenant-specific; validate before adopting. |
| 🔶 **Mandatory** | Required for the capability to function at all. |
| 🔷 **Recommended** | Strongly advised for an enterprise-grade, secure posture, but not strictly required. |

> ⚠️ **Operating constraints (self-imposed, per mission):** This is a design artifact only. It assumes **no access to a production tenant**, executes **no tenant modifications**, and exposes **no credentials or secrets**. All values are reference designs to be validated in a non-production tenant first.

---

## 1. Executive summary

Microsoft Intune is the cloud-native **Unified Endpoint Management (UEM)** service in the Microsoft Intune Suite / Microsoft 365 stack. This blueprint designs an enterprise deployment that:

- Manages **Windows 10/11, Android, iOS/iPadOS, and macOS** endpoints from a single tenant.
- Treats **Microsoft Entra ID as the identity and trust anchor** — Intune is the device-state authority; Entra ID is the policy-enforcement authority via Conditional Access.
- Implements **Zero Trust** ("never trust, always verify") across identity, device, and access layers.
- Supports **distributed, multinational IT administration** through RBAC + scope tags with least-privilege delegation and PIM-protected elevation.
- Provides a **clean separation of corporate vs. personal (BYOD)** device management.

The design is intentionally **modular** so that each downstream engineering agent (Windows, Apps, Security, Identity, Automation, Troubleshooting, QA) owns an implementation domain without overlap.

---

## 2. Architecture design

### 2.1 Intune tenant architecture

✅ **Verified** — An Intune tenant is a single logical instance bound 1:1 to a **Microsoft Entra ID tenant**. Device management, policy, app, and RBAC objects all live inside that tenant boundary.

🧭 **Recommendation — Single production tenant.** For a single organization (even multinational), use **one production tenant** and achieve geographic/organizational separation through **dynamic groups + scope tags**, *not* multiple tenants. Multi-tenant designs multiply administrative overhead, break unified reporting, and complicate Conditional Access. Reserve a **separate non-production ("lab/pilot") tenant** for validating changes before production rollout (see [`enterprise-best-practices.md`](./enterprise-best-practices.md) §Change management).

**Tenant building blocks:**

| Layer | Component | Role in architecture |
| --- | --- | --- |
| Identity | Microsoft Entra ID (tenant) | Users, groups, device identities, authentication, Conditional Access |
| Management | Microsoft Intune service | MDM/MAM policy engine, enrollment, app delivery, compliance evaluation |
| Admin plane | Intune admin center (`intune.microsoft.com`) | Unified console for all workloads |
| Client plane | MDM/MAM channel | CSPs on Windows; Apple MDM protocol; Android Management API |
| Security plane | Microsoft Defender for Endpoint, Conditional Access | Risk signals, threat response, access gating |

> **Service boundary (✅ Verified):** Intune RBAC does **not** apply to Microsoft Entra roles. A holder of the Entra **Intune Administrator** role has full access to Intune regardless of scope tags. This is a critical design fact for delegation — see [`rbac-and-scope-tags.md`](./rbac-and-scope-tags.md).
> Source: [Use RBAC and scope tags for distributed IT](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags)

### 2.2 Microsoft Entra ID integration

Intune and Entra ID are **co-dependent**. The division of responsibility:

| Concern | Owned by | Notes |
| --- | --- | --- |
| User & group identity | Entra ID | Dynamic groups drive policy targeting |
| Device identity object | Entra ID | Created at enrollment/join; Intune attaches management |
| Device **compliance state** | Intune | Evaluated by Intune compliance policies |
| **Access decision** | Entra ID Conditional Access | Consumes Intune compliance signal |
| MFA, risk, Autopilot, dynamic groups | Entra ID P1/P2 | ✅ Required capabilities (§2.11, licensing) |

✅ **Verified** — During enrollment Intune installs an **MDM certificate** on the device; the device object exists in Entra ID, and Intune pushes policy through the MDM channel.
Source: [Enrollment guide: Microsoft Intune enrollment](https://learn.microsoft.com/intune/device-enrollment/guide)

**Entra device join models (Windows):**

| Join model | When to use | Trust |
| --- | --- | --- |
| **Microsoft Entra join** (cloud-only) | 🧭 Default for new corporate Windows devices | Cloud-native, simplest, Autopilot-friendly |
| **Microsoft Entra hybrid join** | Existing on-prem AD dependency (GPO, legacy apps) | Requires Intune Connector for AD + line of sight to a DC |
| **Microsoft Entra registration** | BYOD / personal | Identity registered, device not fully managed via MDM by default |

🧭 **Recommendation:** Target **Entra join (cloud-only)** as the strategic default; treat **hybrid join** as a migration/compatibility path to retire over time. Agent 5 (Identity) owns the join-model decision tree; Agent 2 (Windows) owns Autopilot profile implementation.

### 2.3 Windows 10/11 device management

- **Enrollment:** Windows Autopilot (user-driven, pre-provisioned, or Entra hybrid join) + automatic MDM enrollment. See §2.6.
- **Configuration:** Settings Catalog profiles, Administrative Templates, security baselines (Agent 2 implements).
- **Compliance:** BitLocker, Secure Boot, OS version floor, Defender signals (Agent 4 implements compliance security content).
- **Updates:** Windows Update for Business rings, feature/quality/driver update policies, optionally Windows Autopatch (Agent 2).
- **Apps:** Win32 (`.intunewin`), MSI/LOB, Microsoft Store apps, Microsoft 365 Apps (Agent 3).

✅ **Verified** — Windows Autopilot user-driven deployment runs in two phases: **Device ESP phase** (device-targeted apps/policies) then **User ESP phase** (user-targeted apps/policies).
Source: [Windows Autopilot user-driven Entra join overview](https://learn.microsoft.com/autopilot/tutorial/user-driven/azure-ad-join-workflow)

### 2.4 Android management

✅ **Verified** — **Android device administrator (DA) management is deprecated** and no longer available on devices with Google Mobile Services (GMS). New designs must use **Android Enterprise** management modes.
Source: [What are enrollment restrictions?](https://learn.microsoft.com/intune/device-enrollment/restrictions)

🧭 **Recommended Android management profiles:**

| Scenario | Management mode | Ownership |
| --- | --- | --- |
| BYOD | Android Enterprise **personally-owned work profile** | Personal |
| Corporate, single-user | **Fully managed** (COBO) | Corporate |
| Corporate, single-user + personal space | **Corporate-owned work profile** (COPE) | Corporate |
| Kiosk / frontline / shared | **Dedicated** (COSU) | Corporate |
| Lightweight / no-GMS (AOSP) | **Android (AOSP)** | Corporate |

Android Enterprise requires a **Managed Google Play** connection (Agent 5/Agent 2 implement).

### 2.5 iOS/iPadOS management

🧭 **Recommended iOS/iPadOS enrollment profiles:**

| Scenario | Method | Needs |
| --- | --- | --- |
| Corporate, zero-touch | **Automated Device Enrollment (ADE)** via Apple Business Manager (ABM) | ABM + ADE token + Apple MDM push cert |
| Corporate, manual | **Account-driven / BYOD Apple device enrollment** | Apple MDM push cert |
| BYOD | **BYOD / web enrollment** or **MAM-only (app protection)** | Apple MDM push cert (for MDM) |

✅ **Verified** — All Apple management requires an **Apple MDM Push certificate**; ADE additionally requires an **ADE (DEP) token** synced from ABM. Apple enforces sync limits: a **full sync** no more than once every 7 days; **delta sync** every 12 hours; manual sync no more than once per 15 minutes.
Source: [Manage Apple mobile devices and tokens for ADE](https://learn.microsoft.com/intune/device-enrollment/apple/manage-devices-tokens-apple)

### 2.6 Device enrollment architecture

Enrollment is the control point where identity, ownership, and management attach. The design distinguishes **corporate (known/provisioned)** from **personal (user-initiated)** paths.

| Platform | Corporate path | Personal (BYOD) path |
| --- | --- | --- |
| Windows | Autopilot (Entra join / hybrid / pre-provisioned) | User enrollment via Company Portal / Access Work or School |
| iOS/iPadOS | ADE (ABM) | BYOD device enrollment or MAM-only |
| Android | Fully managed / dedicated / COPE | Personally-owned work profile or MAM-only |
| macOS | ADE (ABM) | BYOD device enrollment |

✅ **Verified** — Enrollment is enabled by default for Android, iOS/iPadOS, Linux, macOS, and Windows; **Windows Server is blocked by default**. Platforms can be restricted via enrollment restriction policies.
Source: [Enrollment guide](https://learn.microsoft.com/intune/device-enrollment/guide)

> **Enrollment restrictions are not a security boundary (✅ Verified):** "Enrollment restrictions are not security features. Compromised devices can misrepresent their character." They are a best-effort barrier for non-malicious users. Security is enforced by **compliance + Conditional Access**.
> Source: [What are enrollment restrictions?](https://learn.microsoft.com/intune/device-enrollment/restrictions)

Detailed enrollment configuration (restrictions, limits, ESP) lives in [`tenant-configuration.md`](./tenant-configuration.md).

### 2.7 Windows Autopilot

✅ **Verified** — Autopilot requires: Windows client + Microsoft Entra ID + an MDM service (Intune), delivered via one of: Microsoft 365 Business Premium; M365 F1/F3; M365 A1/A3/A5; **M365 E3/E5**; EMS E3/E5; or **Entra ID P1/P2 + an Intune subscription**.
Source: [Windows Autopilot requirements](https://learn.microsoft.com/autopilot/requirements)

🧭 **Recommended Autopilot scenario mapping:**

| Scenario | Use when |
| --- | --- |
| **User-driven (Entra join)** | Strategic default for knowledge workers shipped directly from OEM/reseller |
| **Pre-provisioned (white-glove)** | IT/partner pre-stages the device; user receives a near-ready device |
| **Entra hybrid join** | On-prem domain join still required; needs Intune Connector for AD |
| **Autopilot device preparation** | Newer, simplified provisioning model; evaluate for greenfield |

Agent 2 owns Autopilot profile design/implementation. Agent 1 fixes the **join-model and ESP strategy** (see §2.2, [`tenant-configuration.md`](./tenant-configuration.md)).

### 2.8 Configuration and compliance policies

✅ **Verified — the distinction matters architecturally:**
- **Configuration policies** (Settings Catalog, device configuration profiles, security baselines, endpoint security policies) **set** device settings.
- **Compliance policies** primarily **evaluate** whether a device meets requirements and **report** a compliant/noncompliant state. On some platforms they can also prompt remediation (e.g., PIN).
Source: [Manage endpoint security in Intune — FAQ](https://learn.microsoft.com/intune/device-security/endpoint-security-policies)

**Design principle (🧭):** *Configure with configuration/baseline policies; gate with compliance + Conditional Access.* Do not try to "enforce" via compliance alone — compliance is a **signal**, not a block.

✅ **Verified** — Compliance policies **assess** device state but do **not** themselves block access; they work with **Conditional Access** to enforce. A device with **no** compliance policy assigned is treated as **compliant by default** unless the tenant setting "mark devices with no compliance policy as noncompliant" is enabled.
Source: [Zero Trust deployment approach with Intune](https://learn.microsoft.com/intune/fundamentals/zero-trust-deployment) · [Require a device compliance policy](https://learn.microsoft.com/microsoft-365/baseline-security-mode/require-device-compliance-policy)

🔶 **Mandatory tenant hardening:** set **"Devices with no compliance policy = Not compliant"**. Agent 4 owns compliance policy content; Agent 1 mandates this tenant default.

### 2.9 Application lifecycle management

Full implementation is Agent 3's domain. Architecturally, apps flow through a lifecycle:

```
Package/acquire → Assign (Required / Available / Uninstall) → Deliver → Monitor → Update → Retire
```

| App type | Platform | Notes |
| --- | --- | --- |
| Win32 (`.intunewin`) | Windows | Detection/requirement rules, dependencies, supersedence |
| Microsoft 365 Apps | Windows/macOS | Channel + bitness managed centrally |
| Store apps (new Microsoft Store, VPP/ABM) | Win/iOS/macOS | Apple VPP tokens inherit scope tags (✅ Verified) |
| Managed Google Play | Android | Approved apps synced to tenant |
| LOB / managed apps | All | Protected by **App Protection Policies (MAM)** for BYOD |

**App protection policies (MAM)** are the architectural answer to BYOD data protection **without** full device enrollment — a key Zero Trust lever for personal devices (Agent 3 + Agent 4).

### 2.10 Endpoint security architecture & Microsoft Defender integration

✅ **Verified** — The **Endpoint security** node centralizes: security baselines, antivirus, disk encryption, firewall, EDR, attack surface reduction, App Control for Business, account protection, and Defender integration. **Endpoint security policies, security baselines, and compliance policies work *without* Defender for Endpoint**, but Defender integration adds threat detection, **security tasks**, **device risk signals for compliance**, and tamper protection.
Source: [Manage endpoint security in Intune](https://learn.microsoft.com/intune/device-security/endpoint-security-policies)

**Defender for Endpoint integration (✅ Verified prerequisites):**
1. Microsoft Defender for Endpoint **P1 or greater** license.
2. **Service-to-service tenant connection** between Intune and Defender.
3. Defender agent/onboarding on target devices (required for EDR and some policy types).
4. Network access to `*.dm.microsoft.com` for security settings management.
Source: [Manage device security with endpoint security policies](https://learn.microsoft.com/intune/device-configuration/endpoint-security/manage-policies)

🧭 **Recommendation:** Use **endpoint security policies** (not device configuration profiles) for security settings — they expose only relevant settings and are easier to govern. Use **security baselines** as the comprehensive starting posture, then avoid configuring the **same setting in two places** (conflict risk). Agent 4 owns this.

**Platform coverage (✅ Verified):**

| Platform | Endpoint security coverage |
| --- | --- |
| Windows | All policy types (AV, disk encryption, firewall, EDR, ASR, App Control, account protection) |
| macOS | AV, disk encryption (FileVault), firewall, EDR |
| Linux | AV, EDR |
| iOS/Android | Compliance + app protection; Defender deployable as an app for threat detection |

### 2.11 Conditional Access & Zero Trust

✅ **Verified** — Conditional Access (CA) is the **Zero Trust policy engine**. It consumes signals from Entra ID, Microsoft Defender XDR, and Intune (compliance state) to allow/block/step-up access. **CA policies are created in Microsoft Entra ID, not Intune** (the Intune console surfaces the node). Requires **Entra ID P1 or P2**.
Source: [Zero Trust deployment approach with Intune](https://learn.microsoft.com/intune/fundamentals/zero-trust-deployment) · [Common security policies for Microsoft 365](https://learn.microsoft.com/security/zero-trust/zero-trust-identity-device-access-policies-common)

✅ **Verified — the enforcement loop:**
1. Intune compliance policy evaluates the device → marks **compliant / noncompliant**.
2. CA policy "require device to be marked compliant" reads that signal.
3. Noncompliant device → access blocked → user remediates → device re-reports → access restored.
Source: [Require managed devices with Conditional Access](https://learn.microsoft.com/entra/identity/conditional-access/policy-all-users-device-compliance)

🧭 **Recommended CA baseline (identity team / Agent 5 implements):**
- Require **MFA for all users** (and specifically before Intune enrollment, to bind the device to the right person).
- Require **compliant device** (or hybrid-joined) for Microsoft 365 cloud apps.
- Require **approved client app / app protection policy** for mobile access.
- Block legacy authentication.
- Exclude **break-glass** emergency-access accounts from all CA policies (✅ standard Microsoft guidance).

> **CA + enrollment caveat (✅ Verified):** "Require device to be marked as compliant" does **not** block Intune enrollment or access to the Company Portal. New devices can still enroll. If using Windows Subscription Activation, exclude the Universal Store Service APIs app (AppID `45a330b1-b1ec-4cc1-9161-9f03992aa49f`) from device-compliance CA.
> Source: [Common security policies for Microsoft 365](https://learn.microsoft.com/security/zero-trust/zero-trust-identity-device-access-policies-common)

---

## 3. Zero Trust alignment (the seven deployment layers)

✅ **Verified** — Microsoft defines a layered Zero Trust deployment for Intune. This blueprint maps each layer to an owning agent:

| Layer | Zero Trust deployment layer | Owning agent |
| --- | --- | --- |
| 1 | Establish identity & MAM app protection baseline | Agent 5 (Identity) + Agent 3 (Apps) |
| 2 | Enroll devices into management | Agent 2 (Windows) / enrollment arch — Agent 1 |
| 3 | Define device compliance policies | Agent 4 (Security) |
| 4 | Require healthy & compliant devices (Conditional Access) | Agent 5 (Identity) |
| 5 | Deploy configuration profiles (hardening) | Agent 2 (Windows) / Agent 4 |
| 6 | Deploy security baselines & endpoint security | Agent 4 (Security) |
| 7 | Monitor, respond, and continuously improve | Agent 7 (Troubleshooting) + Agent 8 (QA) |

Source: [Zero Trust deployment approach with Microsoft Intune](https://learn.microsoft.com/intune/fundamentals/zero-trust-deployment)

---

## 4. Licensing dependencies (architecture-critical)

✅ **Verified baseline:**

| Goal | Minimum licensing |
| --- | --- |
| Deploy policies/profiles (no enforcement) | Intune |
| Enforce compliance/password rules | Intune **+ Microsoft Entra ID P1 or P2** |
| Autopilot, MFA, Conditional Access, dynamic groups | **Entra ID P1/P2** (P2 for risk-based CA / PIM) |
| Threat signals & EDR | **Microsoft Defender for Endpoint P1+** |
| Information protection (labels/DLP) | Microsoft Purview (E5) |

Sources: [Intune planning guide — costs & licensing](https://learn.microsoft.com/intune/fundamentals/planning-guide) · [Intune licensing](https://learn.microsoft.com/intune/fundamentals/licensing)

✅ **Verified — convenient bundles:** Entra ID P1/P2 + Intune are included in **Microsoft 365 E3 (P1) / E5 (P2)** and **EMS E3/E5**. Microsoft 365 E5 additionally includes Defender for Endpoint and Purview.

✅ **Verified — Intune Suite change (plan for it):** *"Starting July 2026, Suite capabilities are distributed across Microsoft 365 license tiers"* — M365 E3 includes Plan 2, Remote Help, and Advanced Analytics; M365 E5/E7 add Endpoint Privilege Management, Microsoft Cloud PKI, and Enterprise App Management. Other plans can buy the Intune Suite add-on.
Source: [Intune planning guide](https://learn.microsoft.com/intune/fundamentals/planning-guide)

✅ **Verified — unlicensed admin access:** Since June 2021, admin accounts created after the change can administer Intune **without an assigned license**. (Older accounts / nested-group admins may still need a license.) Users who **enroll devices** still need Intune licenses.
Source: [RBAC with Microsoft Intune — unlicensed admins](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/overview)

🧭 **Recommendation:** Standardize on **Microsoft 365 E5** (or E3 + security add-ons) for the managed workforce to unlock Entra P2 (risk-based CA, PIM), Defender for Endpoint, and Purview without piecemeal add-ons. Agent 1 flags; procurement/licensing owner decides.

---

## 5. Security risks & mitigations (architecture level)

| # | Risk | Mitigation | Owner |
| --- | --- | --- | --- |
| R1 | Devices with no compliance policy treated as compliant by default | Enable "no policy = noncompliant"; require compliance in CA | Agent 4 / Agent 5 |
| R2 | Over-privileged admins (standing Global/Intune Admin) | Least-privilege RBAC + PIM just-in-time elevation | Agent 1 / Agent 5 |
| R3 | Enrollment restrictions mistaken for security | Enforce via compliance + CA, not enrollment rules | Agent 1 / Agent 4 |
| R4 | Scope-tag permission "merge" grants broader access than intended | Use the scoped-permission preview; audit multi-assignment admins | Agent 1 |
| R5 | Legacy auth / non-MFA bypassing controls | CA: block legacy auth, require MFA, exclude only break-glass | Agent 5 |
| R6 | Stale device objects inflate attack surface & reporting | Device cleanup rules + Entra stale-device process | Agent 2 / Agent 6 |
| R7 | Policy conflicts between baselines and endpoint security | Single source of truth per setting; conflict monitoring | Agent 4 |
| R8 | Loss of break-glass access / tenant lockout | Documented break-glass accounts excluded from CA; DR runbook | Agent 5 / Agent 7 |
| R9 | BitLocker key loss on device deletion | Back up recovery keys before delete; escrow to Entra | Agent 4 / Agent 7 |

---

## 6. Dependencies handed to downstream agents

This section is a **summary**; the authoritative dependency register is in [`architecture-decisions.md`](./architecture-decisions.md).

- **Agent 2 — Windows Device Management:** Autopilot join model (Entra join default), ESP strategy, Settings Catalog/baseline split, update rings.
- **Agent 3 — Application Management:** App assignment model (Required/Available), MAM for BYOD, Win32 packaging standard, VPP/Managed Google Play connectors.
- **Agent 4 — Endpoint Security:** Compliance policy content, security baselines, Defender integration, encryption, "no policy = noncompliant".
- **Agent 5 — Entra ID & Identity:** Join models, dynamic groups schema, Conditional Access policy set, PIM, break-glass accounts.
- **Agent 6 — PowerShell Automation:** Graph-based group/scope-tag/policy automation, device cleanup automation, reporting exports.
- **Agent 7 — Troubleshooting:** Enrollment/compliance/CA failure runbooks, log collection, DR/continuity drills.
- **Agent 8 — Documentation & QA:** Validate citations, verify mandatory-vs-recommended labeling, consistency across deliverables.

---

## 7. Authoritative references (Microsoft Learn)

- [Intune documentation hub](https://learn.microsoft.com/intune/)
- [Intune planning guide](https://learn.microsoft.com/intune/fundamentals/planning-guide)
- [Set up Microsoft Intune (Step 1)](https://learn.microsoft.com/intune/fundamentals/deploy-setup-step-1)
- [Enrollment guide](https://learn.microsoft.com/intune/device-enrollment/guide)
- [Windows Autopilot requirements](https://learn.microsoft.com/autopilot/requirements)
- [RBAC with Microsoft Intune](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/overview)
- [Manage endpoint security in Intune](https://learn.microsoft.com/intune/device-security/endpoint-security-policies)
- [Zero Trust deployment approach with Intune](https://learn.microsoft.com/intune/fundamentals/zero-trust-deployment)
- [Intune licensing](https://learn.microsoft.com/intune/fundamentals/licensing)
- [Supported operating systems / platforms](https://learn.microsoft.com/intune/fundamentals/ref-supported-platforms)

---

*Prepared by Agent 1 (Senior Microsoft Intune Solution Architect) for the Ruflo orchestrator. Verified facts are cited to Microsoft Learn; recommendations are flagged 🧭 and must be validated in a non-production tenant before adoption.*
