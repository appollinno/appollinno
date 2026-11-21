# Microsoft Intune — Enterprise Best Practices

> **Ruflo Intune Engineering Lab — Agent 1: Senior Microsoft Intune Solution Architect**
> **Document:** `enterprise-best-practices.md`
> **Primary reference:** [Zero Trust deployment approach with Intune](https://learn.microsoft.com/intune/fundamentals/zero-trust-deployment)
> **Last updated:** 2026-11-21

Enterprise recommendations. ✅ = documented fact (cited); 🧭 = architectural recommendation. These are **patterns and principles**; implementation detail belongs to Agents 2–7.

---

## 1. Zero Trust architecture

✅ **Verified** — Microsoft's Zero Trust deployment for Intune uses **seven layers**, moving from *assessment* to *enforcement*: (1) identity + MAM app protection, (2) enroll devices, (3) compliance policies, (4) require healthy/compliant devices via **Conditional Access**, (5) configuration profiles, (6) security baselines/endpoint security, (7) monitor & respond. **Compliance policies assess but don't block; Conditional Access enforces.**
Source: [Zero Trust deployment approach with Intune](https://learn.microsoft.com/intune/fundamentals/zero-trust-deployment)

🧭 **Three Zero Trust principles to apply everywhere:**
1. **Verify explicitly** — authenticate/authorize on identity, device health, location, risk.
2. **Use least-privilege access** — JIT/JEA, risk-based adaptive policies (see §2).
3. **Assume breach** — segment, minimize blast radius, encrypt, monitor, and verify end-to-end.

🧭 **Protection-level model (✅ Microsoft's three tiers):** *Starting point* (MFA + app protection) → *Enterprise* (device compliance) → *Specialized security* (always-MFA for sensitive data). Roll out in that order.
Source: [Common security policies for Microsoft 365](https://learn.microsoft.com/security/zero-trust/zero-trust-identity-device-access-policies-common)

---

## 2. Least privilege (administration)

🧭 **Best practices:**
- Delegate daily admin through **Intune RBAC + scope tags**, never standing Entra high-privilege roles (✅ Microsoft advises against daily use of Intune-Admin-level accounts).
- Make privileged Entra roles **PIM-eligible** (JIT, time-boxed, MFA, approval) — requires **Entra ID P2**.
- Keep **≥2 break-glass** cloud-only accounts, excluded from CA, monitored.
- Run periodic **access reviews** and audit **multi-assignment** admins (permission-merge risk — ✅ verified).
Sources: [Assign a role — least privilege](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/assign-role), [Permission behavior across role assignments](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags#permission-behavior-across-role-assignments). Full model in [`rbac-and-scope-tags.md`](./rbac-and-scope-tags.md).

---

## 3. Device compliance

🧭 **Best practices:**
- 🔶 Set the tenant default **"Devices with no compliance policy = Not compliant"** — otherwise unmanaged devices are compliant-by-default (✅ verified risk).
- Build a **baseline compliance policy per platform** (encryption, OS floor, secure boot, password/PIN, jailbreak/root detection).
- Add **Defender for Endpoint machine-risk** as a compliance signal where licensed (✅ P1+).
- Configure **actions for noncompliance** (notify → grace period → mark noncompliant) rather than instant lockout.
- Compliance is a **signal** — always pair with Conditional Access (§5).
Sources: [Require a device compliance policy](https://learn.microsoft.com/microsoft-365/baseline-security-mode/require-device-compliance-policy), [Zero Trust deployment with Intune](https://learn.microsoft.com/intune/fundamentals/zero-trust-deployment). Content owned by **Agent 4**.

---

## 4. Security baselines

✅ **Verified** — Security baselines are preconfigured groups of Microsoft-recommended Windows settings (Windows, Defender for Endpoint, Edge, etc.). A **CIS audit baseline (preview)** checks Windows 11 against the CIS benchmark **without enforcing**. Baselines and endpoint security policies can coexist, **but don't configure the same setting in both** (conflict risk).
Source: [Manage endpoint security in Intune](https://learn.microsoft.com/intune/device-security/endpoint-security-policies)

🧭 **Best practices:**
- Start from the **Microsoft security baseline**, then customize to your risk appetite.
- Prefer **endpoint security policies** for discrete security settings (they expose only relevant settings).
- Maintain **one source of truth per setting**; monitor **per-setting status** for conflicts.
- Pilot baselines on a ring before broad rollout; track versioning (baselines get new versions).
Owned by **Agent 4**; Windows hardening profiles by **Agent 2**.

---

## 5. Conditional Access

✅ **Verified** — CA policies are authored in **Microsoft Entra ID** (not Intune) and consume Intune compliance + Defender risk + identity signals. Requires **Entra ID P1/P2**. "Require compliant device" does **not** block enrollment/Company Portal.
Sources: [Zero Trust deployment with Intune](https://learn.microsoft.com/intune/fundamentals/zero-trust-deployment), [Common security policies for M365](https://learn.microsoft.com/security/zero-trust/zero-trust-identity-device-access-policies-common).

🧭 **Recommended CA baseline set (Agent 5 implements):**

| Policy | Intent |
| --- | --- |
| Require MFA for all users | Core identity assurance |
| Require MFA before Intune enrollment | Bind device to the right user |
| Require compliant **or** hybrid-joined device for M365 | Device-based access control |
| Require app protection policy for mobile apps | BYOD data protection |
| Block legacy authentication | Close MFA bypass |
| Risk-based (sign-in/user risk) step-up | Adaptive (needs **P2**) |
| Exclude break-glass accounts from all CA | Prevent lockout |

> ✅ Exclude the **Universal Store Service APIs** app (`45a330b1-b1ec-4cc1-9161-9f03992aa49f`) from device-compliance CA if using Windows Subscription Activation.

---

## 6. Policy assignment strategy

🧭 **Best practices:**
- **Assign to groups, not users directly**; prefer **dynamic groups** for scale.
- Use a **ring-based rollout**: `Pilot → Early adopters → Broad → All` (device or user rings) to limit blast radius.
- Use **assignment filters** (device properties) to refine targeting without proliferating groups. (✅ Platform enrollment restrictions already use filters; propagation ~15 min.)
- Prefer **"include group + filter"** over long **exclude** chains. If you must exclude, ensure the exclude group is nested in / listed as a scope group of the RBAC assignment (✅ verified tip).
- Avoid **double-configuring** a setting across baseline + endpoint security + device config (conflict).
- Keep assignment **targets documented** (which group → which policy) for Agent 8 traceability.
Source: [Create device platform restrictions](https://learn.microsoft.com/intune/device-enrollment/create-platform-restrictions), [Scope tags — exclude group tip](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags).

---

## 7. Dynamic device groups

✅ **Verified** — Entra ID P1/P2 enables **dynamic user and device groups** (auto-membership by attributes: city, job title, OS type/version, etc.). Device categories can **auto-add devices to groups**.
Sources: [Intune planning guide](https://learn.microsoft.com/intune/fundamentals/planning-guide), [Enroll devices — categorize into groups](https://learn.microsoft.com/intune/device-enrollment/enroll-devices).

🧭 **Recommended dynamic group schema:**

| Group | Example rule (concept) | Use |
| --- | --- | --- |
| `Devices-Windows-Corp` | `deviceOSType -eq "Windows"` and ownership corporate | Config/baseline targeting |
| `Devices-iOS` / `Devices-Android` | by `deviceOSType` | Platform policies |
| `Devices-Region-EMEA` | device category / extension attribute | Regional delegation + scope tags |
| `Users-BYOD` | by group/attribute | MAM app protection |
| `Ring-Pilot` | assigned (not dynamic) | Controlled rollout |

> 🧭 **Caution:** Keep dynamic rules **simple and documented**; complex rules are hard to debug and slow to process. Agent 6 can automate group creation via Graph; Agent 5 owns the schema.

---

## 8. Administrative delegation

🧭 Covered in depth in [`rbac-and-scope-tags.md`](./rbac-and-scope-tags.md). Key principles:
- Region/BU delegation via **scope tags + scope groups**, not multiple tenants.
- **Auto-apply scope tags** via device-group assignment so new objects inherit tags.
- Central teams (security, platform) hold broad scope; regional teams are contained.
- Review the **scoped-permission preview** to prevent unintended broad access (✅ merge behavior).

---

## 9. Change management

🧭 **Best practices:**
- Maintain a **separate non-production/pilot tenant** (or at minimum pilot rings) to validate changes before production.
- All policy changes go through **ring-based progressive rollout** with defined success criteria and rollback.
- Use **Multi Admin Approval (MAA)** for high-impact changes (✅ Intune feature) to require a second approver.
- Version-control policy definitions as **code/JSON exports** (Agent 6 via Graph) for review, diff, and rollback.
- Maintain a **change log / CAB** record; tie changes to tickets.
Source: [Multi Admin Approval](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/multi-admin-approval).

---

## 10. Monitoring and auditing

✅ **Verified** — Intune provides **audit logs** (e.g., device-cleanup actions are logged and filterable), per-setting and per-device **check-in/assignment status** reports for baselines, **Endpoint analytics**, and the **Intune data warehouse**. Device compliance status is queryable via **Microsoft Graph** and visible in Entra.
Sources: [Device cleanup rules — logging](https://learn.microsoft.com/intune/governance/configure-cleanup-rules), [Defender baseline — monitor](https://learn.microsoft.com/defender-endpoint/configure-machines-security-baseline), [DoD Zero Trust — device pillar](https://learn.microsoft.com/security/zero-trust/dod-zero-trust-strategy-device).

🧭 **Best practices:**
- **Export audit logs to a SIEM** (e.g., Microsoft Sentinel) for retention and correlation.
- Alert on: privileged role activations (PIM), enrollment spikes/failures, compliance drops, baseline per-setting errors.
- Build **operational dashboards**: compliance %, enrollment success, update ring health, app install success.
- Schedule **periodic access reviews** and **stale-device reports** (Agent 6 automates).

---

## 11. Disaster recovery and operational continuity

> Intune is a Microsoft-operated SaaS — there is no infrastructure to restore. DR here means **configuration recoverability, access continuity, and data-key protection**.

🧭 **Best practices:**
- **Configuration-as-code backups:** export all policies, profiles, compliance, apps, groups, and RBAC assignments via **Microsoft Graph** on a schedule; store in version control (Agent 6). This is your "restore" path.
- **Break-glass access:** ≥2 cloud-only emergency accounts, excluded from CA, credentials sealed and tested periodically — prevents tenant lockout (e.g., a bad CA policy).
- **BitLocker/FileVault key escrow:** ensure recovery keys escrow to Entra ID. ⚠️ ✅ **Back up recovery keys before deleting devices** — they are unrecoverable afterward.
- **Rollback runbooks:** documented steps to revert the last change set per workload (Agent 7).
- **Connector/token renewal calendar:** Apple MDM Push cert (annual), ADE/VPP tokens, Managed Google Play — expiry breaks enrollment/management. Track and alert ahead of expiry.
- **Tenant-lockout drill:** rehearse break-glass sign-in and CA-policy revert.
- **Dependency failover:** document behavior if Defender/identity signals are unavailable (fail-closed vs fail-open decisions for CA).
Sources: [Manage stale devices in Entra ID](https://learn.microsoft.com/entra/identity/devices/manage-stale-devices), [Manage Apple devices and tokens](https://learn.microsoft.com/intune/device-enrollment/apple/manage-devices-tokens-apple).

---

## 12. Best-practices summary matrix

| Domain | Mandatory 🔶 | Recommended 🔷 | Owner |
| --- | --- | --- | --- |
| Zero Trust | Compliance + CA enforcement loop | Three-tier rollout | Agents 4/5 |
| Least privilege | PIM on Entra privileged roles; break-glass | Access reviews | Agent 5 |
| Compliance | "No policy = noncompliant"; per-platform baseline | Defender risk signal | Agent 4 |
| Baselines | Security baseline deployed | CIS audit baseline | Agent 4 |
| Conditional Access | MFA + compliant device | Risk-based (P2) | Agent 5 |
| Assignment | Group-based assignment | Rings + filters | Agents 2/3 |
| Dynamic groups | Platform/ownership groups | Documented schema | Agent 5 |
| Change mgmt | Pilot before prod | MAA + config-as-code | Agents 6/8 |
| Monitoring | Audit logging | SIEM export + dashboards | Agents 6/7 |
| DR/continuity | Break-glass + key escrow | Config-as-code backups + drills | Agents 6/7 |

---

## 13. References

- [Zero Trust deployment approach with Intune](https://learn.microsoft.com/intune/fundamentals/zero-trust-deployment)
- [Common security policies for Microsoft 365](https://learn.microsoft.com/security/zero-trust/zero-trust-identity-device-access-policies-common)
- [Manage endpoint security in Intune](https://learn.microsoft.com/intune/device-security/endpoint-security-policies)
- [Multi Admin Approval](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/multi-admin-approval)
- [Device cleanup rules](https://learn.microsoft.com/intune/governance/configure-cleanup-rules)
- [Manage stale devices in Microsoft Entra ID](https://learn.microsoft.com/entra/identity/devices/manage-stale-devices)
- [Intune reports](https://learn.microsoft.com/intune/fundamentals/reports)

---

*Prepared by Agent 1 for the Ruflo orchestrator. Submitted for QA review (Agent 8).*
