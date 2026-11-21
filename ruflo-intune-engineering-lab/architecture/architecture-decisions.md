# Microsoft Intune — Architecture Decision Record (ADR) & Dependency Register

> **Ruflo Intune Engineering Lab — Agent 1: Senior Microsoft Intune Solution Architect**
> **Document:** `architecture-decisions.md`
> **Last updated:** 2026-11-21

This document captures **key architectural decisions** (with trade-offs, licensing dependencies, and risks) and the **dependency register** handed to Agents 2–8. It is the coordination contract with the Ruflo orchestrator.

✅ = documented fact (cited); 🧭 = architectural decision/recommendation by this agent.

---

## Part A — Architecture Decision Records

Each ADR: **Context → Decision → Alternatives → Trade-offs → Licensing → Risk/Mitigation → Owner**.

### ADR-001 — Single production tenant with scope-tag delegation

- **Context:** Multinational org with decentralized IT across EMEA/AMER/APAC.
- **Decision (🧭):** One production tenant; separate non-production/pilot tenant for validation. Geographic/BU separation via **dynamic groups + scope tags**, not multiple production tenants.
- **Alternatives:** Multiple production tenants (per region).
- **Trade-offs:** Single tenant → unified reporting, one CA plane, simpler licensing; but requires disciplined scope-tag design. Multi-tenant → hard isolation but multiplied admin overhead, fragmented reporting, duplicated CA.
- **Licensing:** No extra cost; Entra ID P1/P2 enables dynamic groups.
- **Risk/Mitigation:** Permission-merge across scope tags (R4) → scoped-permission preview + audits.
- **Owner:** Agent 1 (design), Agent 5 (groups).
- Basis: ✅ [Scope tags for distributed IT](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags).

### ADR-002 — Microsoft Entra join (cloud-only) as the strategic Windows default

- **Context:** Windows fleet with some on-prem AD dependencies.
- **Decision (🧭):** Default new corporate Windows devices to **Entra join + Autopilot user-driven**. Use **hybrid join** only where on-prem domain join is still required, as a path to retire.
- **Alternatives:** Hybrid join as default.
- **Trade-offs:** Entra join → simplest, cloud-native, Autopilot-friendly, no DC line-of-sight. Hybrid → supports legacy GPO/apps but needs **Intune Connector for AD** and DC connectivity (more moving parts, more failure modes).
- **Licensing:** ✅ Autopilot needs Entra ID P1/P2 + Intune (via M365 E3/E5, EMS, etc.).
- **Risk/Mitigation:** Legacy app dependency → inventory first; provide hybrid bridge.
- **Owner:** Agent 2 (implement), Agent 5 (join model).
- Basis: ✅ [Autopilot requirements](https://learn.microsoft.com/autopilot/requirements), [Autopilot Entra join workflow](https://learn.microsoft.com/autopilot/tutorial/user-driven/azure-ad-join-workflow).

### ADR-003 — Android Enterprise only; block Android device administrator

- **Context:** Android DA is deprecated on GMS devices.
- **Decision (🧭):** Manage Android exclusively via **Android Enterprise** modes (work profile, fully managed, dedicated, COPE, AOSP). **Block DA** in enrollment restrictions.
- **Alternatives:** Continue DA (not viable).
- **Trade-offs:** None meaningful — DA is end-of-life on GMS.
- **Licensing:** Intune; Managed Google Play connection required.
- **Risk/Mitigation:** Legacy DA devices → migrate to AE / replace.
- **Owner:** Agent 2 (Android config), Agent 5 (Managed Google Play).
- Basis: ✅ [Enrollment restrictions — Android DA deprecation](https://learn.microsoft.com/intune/device-enrollment/restrictions).

### ADR-004 — Enforce security via Compliance + Conditional Access, not enrollment restrictions

- **Context:** Enrollment restrictions are sometimes mistaken for a security boundary.
- **Decision (🔶/🧭):** Treat enrollment restrictions as hygiene/targeting only. Enforce security through **compliance policies + Conditional Access**, and set **"no compliance policy = noncompliant."**
- **Alternatives:** Rely on enrollment restrictions (rejected — ✅ "not security features").
- **Trade-offs:** Requires Entra ID P1/P2 and identity-team coordination; stronger, verifiable posture.
- **Licensing:** ✅ Entra ID P1/P2 (compliance enforcement + CA).
- **Risk/Mitigation:** Default compliant-by-default (R1) → tenant setting + CA require-compliant.
- **Owner:** Agent 4 (compliance), Agent 5 (CA).
- Basis: ✅ [Enrollment restrictions](https://learn.microsoft.com/intune/device-enrollment/restrictions), [Require a device compliance policy](https://learn.microsoft.com/microsoft-365/baseline-security-mode/require-device-compliance-policy).

### ADR-005 — Least privilege + PIM for privileged administration

- **Context:** Avoid standing high-privilege accounts.
- **Decision (🔶/🧭):** Daily admin via Intune RBAC + scope tags. Entra Global/Intune/Security Administrator made **PIM-eligible** (JIT, MFA, approval). ≥2 break-glass accounts excluded from CA.
- **Alternatives:** Standing admin roles (rejected — ✅ Microsoft advises against).
- **Trade-offs:** PIM adds activation friction; large reduction in standing attack surface.
- **Licensing:** ✅ **Entra ID P2** for PIM and risk-based CA.
- **Risk/Mitigation:** Over-privilege (R2), lockout (R8) → PIM + break-glass + reviews.
- **Owner:** Agent 1 (RBAC design), Agent 5 (PIM).
- Basis: ✅ [Assign a role — least privilege](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/assign-role).

### ADR-006 — Endpoint security policies + security baselines as the hardening model

- **Decision (🧭):** Use **security baselines** for comprehensive posture and **endpoint security policies** for discrete security settings; never configure the same setting twice; integrate **Defender for Endpoint** for risk signals and EDR.
- **Trade-offs:** Requires conflict discipline; cleaner than device-config profiles for security.
- **Licensing:** ✅ Defender for Endpoint **P1+** for integration/EDR; some advanced capabilities move into M365 E3/E5 tiers **from July 2026** (Intune Suite redistribution).
- **Risk/Mitigation:** Policy conflicts (R7) → single source of truth + per-setting monitoring.
- **Owner:** Agent 4.
- Basis: ✅ [Manage endpoint security](https://learn.microsoft.com/intune/device-security/endpoint-security-policies), [Intune planning guide — Suite July 2026](https://learn.microsoft.com/intune/fundamentals/planning-guide).

### ADR-007 — BYOD prefers MAM (App Protection Policies) over full enrollment

- **Decision (🧭):** For personal devices, prefer **MAM-only app protection**; use full enrollment only when required.
- **Trade-offs:** MAM → better privacy/adoption, protects app data not the whole device; full MDM → more control, more intrusion, lower BYOD adoption.
- **Licensing:** Intune (MAM); CA require-app-protection needs Entra ID P1/P2.
- **Risk/Mitigation:** Data leakage on unmanaged OS → app-level encryption, save-as/copy-paste controls.
- **Owner:** Agent 3 (app protection), Agent 4 (data protection), Agent 5 (CA).
- Basis: ✅ [Zero Trust — manage devices with Intune app protection](https://learn.microsoft.com/security/zero-trust/manage-devices-with-intune-overview).

### ADR-008 — Device cleanup rules + Entra stale-device governance

- **Decision (🧭):** Enable Intune **device cleanup rules** (hide inactive, 30–270 days) and a **separate scheduled Entra stale-device** process (disable → delete).
- **Trade-offs:** Cleanup only *hides* in Intune and does **not** remove the Entra object (✅); two processes needed.
- **Licensing:** Intune + Entra ID.
- **Risk/Mitigation:** Stale-device surface (R6); BitLocker key loss on delete (R9) → escrow + back up keys before delete.
- **Owner:** Agent 2 (rules), Agent 6 (Entra automation), Agent 7 (key safeguards).
- Basis: ✅ [Device cleanup rules](https://learn.microsoft.com/intune/governance/configure-cleanup-rules), [Manage stale devices in Entra](https://learn.microsoft.com/entra/identity/devices/manage-stale-devices).

### ADR-009 — Configuration-as-code via Microsoft Graph for change mgmt & DR

- **Decision (🧭):** Export and version-control all Intune config (policies, apps, groups, RBAC) via **Microsoft Graph**; drive change management through rings + **Multi Admin Approval**.
- **Trade-offs:** Up-front automation investment; delivers diff/rollback, DR restore path, auditability.
- **Licensing:** Included (Graph).
- **Risk/Mitigation:** Config loss / bad change → restore from code; MAA second-approver.
- **Owner:** Agent 6 (automation), Agent 8 (QA/traceability).
- Basis: ✅ [Multi Admin Approval](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/multi-admin-approval).

---

## Part B — Licensing dependency summary

| Capability | Minimum license | ✅ Source |
| --- | --- | --- |
| Policy/profile deployment | Intune | [licensing](https://learn.microsoft.com/intune/fundamentals/licensing) |
| Compliance enforcement | Intune + **Entra ID P1/P2** | [planning guide](https://learn.microsoft.com/intune/fundamentals/planning-guide) |
| Autopilot, MFA, CA, dynamic groups | **Entra ID P1/P2** | [Autopilot requirements](https://learn.microsoft.com/autopilot/requirements) |
| Risk-based CA, PIM | **Entra ID P2** | [planning guide](https://learn.microsoft.com/intune/fundamentals/planning-guide) |
| Defender integration / EDR | **Defender for Endpoint P1+** | [manage policies](https://learn.microsoft.com/intune/device-configuration/endpoint-security/manage-policies) |
| EPM, Cloud PKI, Enterprise App Mgmt | Intune Suite / **M365 E5/E7 (from Jul 2026)** | [planning guide](https://learn.microsoft.com/intune/fundamentals/planning-guide) |
| Information protection (labels/DLP) | Microsoft Purview (E5) | [planning guide](https://learn.microsoft.com/intune/fundamentals/planning-guide) |

🧭 **Recommendation:** Standardize the managed workforce on **Microsoft 365 E5** (or E3 + security add-ons) to unlock Entra P2, Defender, and Purview coherently. Confirm Intune licenses are assigned to **enrolling users** (✅ required even under M365 bundles; admins may be unlicensed since June 2021).

---

## Part C — Consolidated risk register

| # | Risk | Severity | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| R1 | No-compliance-policy = compliant by default | High | Tenant setting + CA require-compliant | Agent 4/5 |
| R2 | Over-privileged standing admins | High | RBAC + PIM + reviews | Agent 1/5 |
| R3 | Enrollment restrictions mistaken for security | Medium | Enforce via compliance + CA | Agent 1/4 |
| R4 | Scope-tag permission merge | Medium | Scoped-permission preview + audit | Agent 1/8 |
| R5 | Legacy auth / non-MFA | High | CA block legacy, require MFA | Agent 5 |
| R6 | Stale device objects | Medium | Cleanup rules + Entra stale process | Agent 2/6 |
| R7 | Baseline vs endpoint-security conflicts | Medium | Single source per setting + monitoring | Agent 4 |
| R8 | Tenant lockout / loss of break-glass | High | Break-glass accounts excluded from CA; DR drill | Agent 5/7 |
| R9 | BitLocker key loss on device delete | High | Escrow + back up keys before delete | Agent 4/7 |
| R10 | Connector/token expiry breaks enrollment | High | Renewal calendar + alerts (Apple cert, ADE/VPP, Google) | Agent 5/7 |

---

## Part D — Dependency register & handoffs to downstream agents

> **Principle:** Agent 1 defines architecture and constraints; Agents 2–7 own implementation; Agent 8 validates. **No implementation duplication.**

### Agent 2 — Windows Device Management Engineer
**Inputs from Agent 1:** Entra join default (ADR-002); Autopilot scenario map; ESP strategy (critical-app blocking, 51-profile limit); device cleanup thresholds; config-vs-baseline split.
**Owns:** Autopilot profiles, Windows Settings Catalog/ADMX, update rings (WUfB / Autopatch), ESP implementation, Windows hardening profiles, co-management sliders.
**Must not:** Author compliance policy content (Agent 4) or CA (Agent 5).

### Agent 3 — Application Management Engineer
**Inputs:** App lifecycle model; assignment strategy (Required/Available/Uninstall + rings); MAM-for-BYOD (ADR-007); connector prerequisites (VPP/ABM, Managed Google Play).
**Owns:** Win32 packaging standard, M365 Apps config, Store/VPP/Managed Google Play apps, App Protection Policies, supersedence/dependencies, detection rules.
**Must not:** Own device compliance or endpoint security policy.

### Agent 4 — Endpoint Security Engineer
**Inputs:** "No policy = noncompliant" mandate; compliance-as-signal model; baseline + endpoint-security model (ADR-006); Defender integration prerequisites; conflict-avoidance rule.
**Owns:** Compliance policies (per platform), security baselines, antivirus/firewall/disk-encryption/EDR/ASR/App Control, Defender tenant connection + risk-as-compliance, encryption key escrow.
**Must not:** Author CA policies (Agent 5 — but provides the required compliance signals).

### Agent 5 — Microsoft Entra ID & Identity Engineer
**Inputs:** Join-model decision tree; dynamic-group schema; CA baseline set; PIM model; break-glass requirement; MFA-at-enrollment mandate; Universal Store Service API exclusion.
**Owns:** Entra dynamic groups, Conditional Access policy set, PIM configuration, break-glass accounts, MFA/authentication methods, Apple/Google connector identity prerequisites, cross-tenant trust.
**Must not:** Own device-side compliance content (consumes it).

### Agent 6 — PowerShell Automation Engineer
**Inputs:** Config-as-code mandate (ADR-009); scope-tag auto-assignment; cleanup/stale-device automation; reporting/export needs.
**Owns:** Microsoft Graph automation (export/import policies, groups, scope tags, RBAC assignments), scheduled stale-device cleanup, reporting pipelines, CI for config-as-code.
**Must not:** Execute production tenant modifications without change-management approval (Agent 8 / orchestrator gate).

### Agent 7 — Intune Troubleshooting Engineer
**Inputs:** Known failure points (enrollment cap `DeviceCapReached`, ESP timeouts, CA/compliance loop, connector/token expiry, permission-merge); DR/continuity requirements.
**Owns:** Runbooks (enrollment, compliance, CA, app install, sync), diagnostics/log collection, rollback procedures, DR drills (break-glass, CA revert, key recovery), token/cert renewal calendar.
**Must not:** Redesign architecture; feeds findings back to Agent 1.

### Agent 8 — Documentation & Quality Assurance Engineer
**Inputs:** All six architecture deliverables with ✅/🧭 and 🔶/🔷 labels and Microsoft Learn citations.
**Owns:** Verify citations resolve and support claims; check mandatory-vs-recommended labeling; cross-document consistency; confirm no implementation duplication across agents; sign-off gate before production.
**Must not:** Alter architectural intent without routing through Agent 1.

---

## Part E — Open questions for the orchestrator / organization

1. **Licensing tier confirmation** — Is the managed workforce on M365 E5, E3+add-ons, or EMS? (Determines P2-dependent features: PIM, risk-based CA.)
2. **On-prem AD footprint** — How many apps/GPOs still require hybrid join? (Scopes ADR-002 bridge.)
3. **BYOD policy** — Is MAM-only acceptable, or is full enrollment mandated for personal devices? (Scopes ADR-007.)
4. **Regional data/compliance constraints** — Any data-residency or regulatory drivers that would challenge the single-tenant decision (ADR-001)?
5. **Jamf for macOS?** — If present, note ✅ cleanup rules and some scope-tag behavior don't apply to Jamf-managed devices.
6. **Intune Suite timing** — Adopt before or after the July 2026 capability redistribution?

---

## Part F — Acceptance criteria (for QA sign-off)

- [ ] All six deliverables present in `ruflo-intune-engineering-lab/architecture/`.
- [ ] Every ✅ claim cites Microsoft Learn; every 🧭 is flagged as a recommendation.
- [ ] Mandatory (🔶) vs recommended (🔷) clearly distinguished.
- [ ] Four Mermaid diagrams render.
- [ ] Licensing dependencies identified per capability.
- [ ] Security risks + mitigations enumerated with owners.
- [ ] Dependency handoffs defined for Agents 2–8 with no implementation overlap.
- [ ] No production tenant modifications performed; no credentials exposed.

---

*Prepared by Agent 1 (Senior Microsoft Intune Solution Architect) for the Ruflo orchestrator. Submitted for QA review (Agent 8).*
