# Microsoft Intune — RBAC & Scope Tags Architecture

> **Ruflo Intune Engineering Lab — Agent 1: Senior Microsoft Intune Solution Architect**
> **Document:** `rbac-and-scope-tags.md`
> **Primary reference:** [RBAC with Microsoft Intune](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/overview)
> **Last updated:** 2026-11-21

Defines the **administrative access model**: built-in roles, scope tags/groups, a multinational delegation example, least privilege, and PIM. ✅ = documented fact (cited); 🧭 = architectural recommendation.

> ⚠️ Design artifact only — **no production tenant access**, **no tenant modifications**, **no credentials exposed**.

---

## 1. How Intune RBAC works (verified foundations)

✅ **Verified core facts:**
1. Each Intune RBAC role = a set of **permissions** (management categories × actions: Read/Create/Update/Delete/Assign/View Reports).
2. **Roles are assigned to groups, not individual users.** Each member of the assigned group inherits the role's permissions.
3. Permissions across multiple role assignments are **cumulative** — *there is no deny*. You cannot subtract a permission.
4. **Scope tags** limit *which objects* an admin can see; **roles** limit *what actions* they can take.
5. A role assignment has **Admin Groups** (who gets the permissions), **Scope (Groups)** (which users/devices they manage), and **Scope tags** (which tagged objects they see).
6. **Intune RBAC does not apply to Microsoft Entra roles.** An Entra **Intune Administrator** has full Intune access regardless of scope tags.
7. Since June 2021, **admin accounts can be unlicensed** (accounts created after the change).

Sources: [RBAC overview](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/overview) · [Assign a role](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/assign-role) · [Scope tags for distributed IT](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags)

> ⚠️ ✅ **Verified — the "permission merge" gotcha:** When an admin holds **multiple role assignments with different scope tags**, Intune's default behavior **merges** permissions across assignments, which **can grant broader access than intended**. An **opt-in preview** contains each assignment's permissions to its own scope-tag context. **Audit multi-assignment admins** and evaluate the scoped-permission preview.
> Source: [Permission behavior across role assignments](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags#permission-behavior-across-role-assignments)

---

## 2. Two RBAC systems — know the boundary

| System | Governs | Examples | Supports scope tags? |
| --- | --- | --- | --- |
| **Microsoft Entra roles** | Tenant-wide identity/admin | Global Administrator, Intune Administrator, Security Administrator | ❌ No (full Intune access) |
| **Intune RBAC roles** | Intune objects only | Help Desk Operator, Policy and Profile Manager, Endpoint Security Manager | ✅ Yes |

🧭 **Design rule:** Use **Entra roles sparingly** (they bypass scope tags). Do **daily delegated administration** through **Intune RBAC roles + scope tags**. Reserve Entra **Intune Administrator / Global Administrator** for setup and rare privileged tasks, protected by **PIM**.

---

## 3. Role responsibilities

### 3.1 Entra ID roles (privileged — PIM-protected)

| Role | Responsibility | 🧭 Recommendation |
| --- | --- | --- |
| **Global Administrator** | Full tenant control; last-resort. | Minimize; **PIM just-in-time only**; keep ≤ a handful; never for daily work. ✅ Microsoft advises against daily use of high-privilege accounts. |
| **Intune Administrator** (Intune Service Administrator) | Full Intune control; **required** for initial setup, device limit restrictions, creating scope tags. | **PIM eligible**, not permanent. ✅ Needed for setup & some tenant-level settings. |
| **Security Administrator** | Manage security features/baselines across Defender + Intune. | PIM; assign to the security function (Agent 4). |

Sources: [Assign a role](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/assign-role) · [Create device limit restrictions (requires Intune Service Admin)](https://learn.microsoft.com/intune/device-enrollment/create-device-limit-restrictions) · [Create a scope tag (requires Intune Administrator)](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags)

### 3.2 Intune built-in roles (✅ verified descriptions)

| Built-in role | What it does |
| --- | --- |
| **Application Manager** | Manages mobile & managed apps; reads device info; views device configuration profiles. |
| **Help Desk Operator** | Performs remote tasks on users/devices; can assign apps/policies to users/devices. |
| **Endpoint Security Manager** | Manages security & compliance: security baselines, device compliance, Conditional Access, Defender for Endpoint. |
| **Policy and Profile Manager** | Manages compliance policy, configuration profiles, Apple enrollment, corporate device identifiers, security baselines. |
| **Read Only Operator** | Views user/device/enrollment/config/app info; **cannot** make changes. |
| **Intune Role Administrator** | Manages custom Intune roles and assignments; **the only Intune role that can assign permissions to admins**. |
| **School Administrator** | Manages apps/settings/devices for Intune for Education. |
| **Endpoint Privilege Manager / Reader** | Manages / reads EPM policies (Intune Suite capability). |

Source: [RBAC overview — built-in roles](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/overview)

**Representative permission detail (✅ verified):**
- **Help Desk Operator** includes remote tasks (reboot, sync, restart, remote lock, reset passcode, retire, wipe, collect diagnostics, Remote Help control, rotate BitLocker keys (preview)), Managed apps *Assign/Read/Wipe*, Managed devices *Read/Update/Set primary user/View reports*, Security baselines *Read*. ([Help Desk Operator reference](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/ref-built-in-roles#help-desk-operator))
- **Read Only Operator** is **Read / View Reports only** across compliance, configurations, apps, EDR, endpoint analytics, etc. ([Read Only Operator reference](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/ref-built-in-roles#read-only-operator))

---

## 4. Mission role → recommended implementation mapping

The mission names six administrative personas. This maps each to the least-privilege implementation:

| Mission persona | Implement as | Scope tags? | Notes |
| --- | --- | --- | --- |
| **Global Administrator responsibilities** | Entra **Global Administrator** | ❌ | Setup & emergency only; PIM; ≤ ~2–4 accounts + break-glass. |
| **Intune Administrator responsibilities** | Entra **Intune Administrator** | ❌ | Tenant-wide Intune config, scope-tag creation, device limit restrictions; PIM eligible. |
| **Helpdesk Operator permissions** | Intune **Help Desk Operator** | ✅ | Scope to region/business unit; remote tasks + assignment only. |
| **Application Manager permissions** | Intune **Application Manager** | ✅ | App lifecycle; no device config authority. |
| **Security Administrator permissions** | Intune **Endpoint Security Manager** (+ Entra **Security Administrator** where cross-portal) | ✅ (Intune role) | Baselines, compliance, CA, Defender. |
| **Read-only Auditor permissions** | Intune **Read Only Operator** | ✅ | Audit/reporting; zero write. |

> ✅ **Verified** — Creating/editing **device limit restrictions** needs **Intune Service Administrator**; other roles are read-only for it. Creating **scope tags** needs the **Intune Administrator** Entra role. Plan these privileged tasks around PIM elevation.
> Sources: [device limit restrictions](https://learn.microsoft.com/intune/device-enrollment/create-device-limit-restrictions) · [create a scope tag](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags)

---

## 5. Scope tags — design

✅ **Verified scope-tag behavior:**
- Scope tags are **free-form text values** defined by an admin and added to role assignments and objects.
- When an admin **creates** an object, **all scope tags assigned to that admin are auto-applied** to the new object.
- An admin with **no scope tags** effectively has **all** scope tags (sees everything within their permissions).
- You can assign up to **100 scope tags** to an object or role.
- You can only **assign a scope tag you already hold**, and only **target groups listed in your role assignment's Scope (Groups)**.
- Objects **not supporting scope tags:** Corp Device Identifiers, **Windows Autopilot devices**, Device compliance locations, Jamf devices.
- **VPP apps & ebooks inherit** the scope tags of their VPP token.
- If a role assignment has a scope tag, you **cannot remove all** scope tags from an object (≥1 required).
- Auto scope-tag (group-based) assignments **overwrite** manual ones; multiple group-assigned tags all apply.

Source: [Use RBAC and scope tags for distributed IT](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags)

🧭 **Recommended scope-tag taxonomy** (keep it small and stable — tags are hard to refactor):

| Dimension | Example tags |
| --- | --- |
| **Geography / region** | `EMEA`, `AMER`, `APAC`, `MZ` (Mozambique) |
| **Business unit** (optional) | `Corp-IT`, `Retail`, `Clinical` |
| **Environment** | `Pilot`, `Production` |
| **Ownership** | `Corporate`, `BYOD` |

> 🧭 **Anti-pattern:** Over-tagging (a tag per office). Prefer a **small set of orthogonal dimensions** (region + ownership + environment). Model them as **automatic scope-tag assignment via device groups** so new devices inherit tags at enrollment.

---

## 6. Scope groups vs. scope tags — the three levers

Every Intune role **assignment** combines three things (✅ verified):

```
Assignment = Admin Groups  +  Scope (Groups)        +  Scope Tags
             (who is admin)   (which users/devices    (which tagged objects
                               they can manage)         they can see)
```

🧭 **Design guidance:**
- **Admin Groups** → an Entra group of the delegated admins (e.g., `RBAC-Admins-HelpDesk-EMEA`).
- **Scope (Groups)** → the managed population (e.g., `Devices-EMEA`, `Users-EMEA`) — use dynamic groups where possible.
- **Scope Tags** → match the tags applied to that region's policies/apps/devices (e.g., `EMEA`).

---

## 7. Worked example — multinational organization with decentralized IT

**Scenario (🧭):** *"Ruflo Global"* operates in three regions — **EMEA** (HQ incl. Mozambique), **AMER**, **APAC** — each with its own local helpdesk and app owners, plus a **central** security and platform team.

### 7.1 Entra groups (naming convention)

| Group | Type | Purpose |
| --- | --- | --- |
| `RBAC-Admins-Global-Platform` | Assigned | Central Intune administrators (PIM) |
| `RBAC-Admins-Security` | Assigned | Central security team |
| `RBAC-Admins-HelpDesk-EMEA/AMER/APAC` | Assigned | Regional helpdesk |
| `RBAC-Admins-Apps-EMEA/AMER/APAC` | Assigned | Regional app managers |
| `RBAC-Auditors-Global` | Assigned | Read-only auditors |
| `Devices-EMEA/AMER/APAC` | **Dynamic device** | Managed scope population (rule on `deviceOSType`/category/region attribute) |
| `Users-EMEA/AMER/APAC` | **Dynamic user** | e.g., `user.country -eq "MZ"` → EMEA |

### 7.2 Scope tags

`EMEA`, `AMER`, `APAC`, plus `Corporate` / `BYOD`, `Pilot` / `Production`.

### 7.3 Role assignments (the delegation matrix)

| Admin group | Intune role | Scope (Groups) | Scope tags |
| --- | --- | --- | --- |
| `RBAC-Admins-Global-Platform` | *(Entra Intune Administrator via PIM)* | All | *(none = all)* |
| `RBAC-Admins-Security` | **Endpoint Security Manager** | All devices | *(none = all, or `Production`)* |
| `RBAC-Admins-HelpDesk-EMEA` | **Help Desk Operator** | `Users-EMEA`, `Devices-EMEA` | `EMEA` |
| `RBAC-Admins-HelpDesk-AMER` | **Help Desk Operator** | `Users-AMER`, `Devices-AMER` | `AMER` |
| `RBAC-Admins-Apps-EMEA` | **Application Manager** | `Devices-EMEA` | `EMEA` |
| `RBAC-Auditors-Global` | **Read Only Operator** | All | *(none = all)* |

**Result (🧭):** An EMEA helpdesk operator can remote-reboot/retire EMEA devices and assign EMEA-tagged apps/policies, but **cannot see or touch** AMER/APAC objects. The central security team manages baselines/compliance everywhere. Auditors see all, change nothing.

> ✅ **Verified caveat to communicate to Agent 6/8:** Because permissions **merge** across assignments, an admin placed in **both** `HelpDesk-EMEA` and `Apps-AMER` could gain broader effective access than either alone. Keep admins in **one region's assignment set**, and evaluate the **scoped-permission preview**.
> Source: [Permission behavior across role assignments](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags#permission-behavior-across-role-assignments)

---

## 8. Least privilege & Privileged Identity Management (PIM)

✅ **Verified** — Microsoft **advises against using Intune/Global Administrator-level accounts for daily management when lesser-privileged roles suffice**. High-privilege Entra roles are needed for *initial setup* (adding users, groups, assigning RBAC); afterwards, switch to least-privileged accounts.
Source: [Assign a role — least privilege](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/assign-role)

🧭 **Recommended PIM model** (Agent 5 implements; requires **Entra ID P2**):

| Principle | Implementation |
| --- | --- |
| No standing privilege | Make Global/Intune/Security Administrator **eligible**, not permanently active. |
| Just-in-time | Activate on demand, time-boxed (e.g., 1–8h), with justification. |
| Approval + MFA | Require MFA on activation; approval workflow for Global Administrator. |
| Access reviews | Periodic recertification of role eligibility. |
| Alerting | Alert on privileged activations; audit to SIEM. |
| Break-glass | ≥2 cloud-only emergency accounts, **excluded from CA**, stored offline, monitored. |

> ⚠️ **Note:** Native **PIM governs Entra roles**. Intune's own built-in RBAC roles are not PIM-eligible the same way — contain them with **least-privilege scope tags + scope groups** and review membership of the **assigned admin groups** regularly.

---

## 9. RBAC implementation checklist

| # | Action | Status | Owner |
| --- | --- | --- | --- |
| 1 | Define scope-tag taxonomy (region + ownership + env) | 🔷 | Agent 1 |
| 2 | Create Entra admin groups per role/region | 🔶 | Agent 5 |
| 3 | Create dynamic device/user groups per region | 🔷 | Agent 5 |
| 4 | Assign Intune built-in roles with Scope (Groups) + tags | 🔶 | Agent 1/5 |
| 5 | Auto-assign scope tags via device groups | 🔷 | Agent 6 |
| 6 | Enable PIM for Global/Intune/Security Administrator | 🔶 | Agent 5 |
| 7 | Create & document break-glass accounts | 🔶 | Agent 5/7 |
| 8 | Evaluate scoped-permission preview; audit multi-assignment admins | 🔷 | Agent 1/8 |
| 9 | Schedule access reviews | 🔷 | Agent 5 |

---

## 10. References

- [RBAC with Microsoft Intune](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/overview)
- [Built-in role permissions for Intune](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/ref-built-in-roles)
- [Assign a role in Intune](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/assign-role)
- [Use RBAC and scope tags for distributed IT](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags)
- [Create a custom role](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/create-custom-role)
- [Permission behavior across role assignments](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags#permission-behavior-across-role-assignments)
- [Microsoft Entra built-in roles reference](https://learn.microsoft.com/entra/identity/role-based-access-control/permissions-reference)

---

*Prepared by Agent 1 for the Ruflo orchestrator. Submitted for QA review (Agent 8).*
