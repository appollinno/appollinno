# Microsoft Intune — Architecture Diagrams

> **Ruflo Intune Engineering Lab — Agent 1: Senior Microsoft Intune Solution Architect**
> **Document:** `intune-architecture-diagrams.md`
> **Last updated:** 2026-11-21

Four Mermaid diagrams illustrating the architecture. Rendered on GitHub and any Mermaid-aware viewer. Each diagram is paired with a short legend. These are **architecture views** (design intent), cross-referenced to the verified facts in the companion documents.

**Diagram index**
1. [Microsoft Intune high-level architecture](#1-microsoft-intune-high-level-architecture)
2. [Intune and Microsoft Entra ID integration](#2-intune-and-microsoft-entra-id-integration)
3. [RBAC and scope tags architecture](#3-rbac-and-scope-tags-architecture)
4. [Device enrollment and management workflow](#4-device-enrollment-and-management-workflow)

---

## 1. Microsoft Intune high-level architecture

```mermaid
graph TB
    subgraph Admins["Administration plane"]
        AC["Intune admin center<br/>intune.microsoft.com"]
        GR["Microsoft Graph API<br/>(automation - Agent 6)"]
    end

    subgraph Cloud["Microsoft cloud services"]
        ENTRA["Microsoft Entra ID<br/>Identity - Users - Groups - Devices"]
        INTUNE["Microsoft Intune<br/>UEM policy and app engine"]
        CA["Conditional Access<br/>(Entra - Zero Trust engine)"]
        MDE["Microsoft Defender<br/>for Endpoint - XDR"]
        PURVIEW["Microsoft Purview<br/>Information protection"]
    end

    subgraph Connectors["Platform connectors and tokens"]
        APPLE["Apple Business Manager<br/>MDM push cert - ADE - VPP"]
        GOOGLE["Managed Google Play<br/>Android Enterprise"]
        ADC["Intune Connector for AD<br/>(hybrid join)"]
    end

    subgraph Endpoints["Managed endpoints"]
        WIN["Windows 10/11"]
        IOS["iOS / iPadOS"]
        AND["Android Enterprise"]
        MAC["macOS"]
    end

    AC --> INTUNE
    GR --> INTUNE
    INTUNE <--> ENTRA
    INTUNE <--> MDE
    ENTRA --> CA
    CA -. compliance signal .-> INTUNE
    MDE -. risk signal .-> INTUNE
    INTUNE --> PURVIEW

    INTUNE --> APPLE
    INTUNE --> GOOGLE
    INTUNE --> ADC

    APPLE --> IOS
    APPLE --> MAC
    GOOGLE --> AND
    ADC --> WIN
    INTUNE -->|MDM channel / CSP| WIN
    INTUNE -->|Apple MDM protocol| IOS
    INTUNE -->|Apple MDM protocol| MAC
    INTUNE -->|Android Mgmt API| AND

    CA ==>|Allow / Block / Step-up| Endpoints
```

**Legend.** Intune is the UEM policy/app engine; **Entra ID** is the identity anchor and hosts **Conditional Access**, the Zero Trust enforcement point. Intune evaluates device **compliance** and feeds the signal to CA; **Defender for Endpoint** feeds risk signals back to Intune compliance. Platform connectors (Apple/Google/AD) are mandatory prerequisites for their platforms.
Verified basis: [Manage endpoint security in Intune](https://learn.microsoft.com/intune/device-security/endpoint-security-policies), [Zero Trust deployment with Intune](https://learn.microsoft.com/intune/fundamentals/zero-trust-deployment).

---

## 2. Intune and Microsoft Entra ID integration

```mermaid
graph LR
    subgraph EntraID["Microsoft Entra ID (P1 / P2)"]
        U["Users"]
        G["Dynamic groups<br/>(user + device)"]
        DEVOBJ["Device identity object"]
        CAP["Conditional Access policies"]
        MFA["MFA / risk (P2)"]
        PIM["Privileged Identity Mgmt (P2)"]
    end

    subgraph IntuneSvc["Microsoft Intune"]
        ENR["Enrollment<br/>+ MDM certificate"]
        CFG["Configuration profiles<br/>+ security baselines"]
        COMP["Compliance policies<br/>(evaluate state)"]
        APPS["App + App protection (MAM)"]
    end

    DEV["Managed device"]

    U --> G
    G -->|targeting| CFG
    G -->|targeting| COMP
    G -->|targeting| APPS
    ENR --> DEVOBJ
    DEV --> ENR
    CFG --> DEV
    APPS --> DEV
    COMP -->|compliant / noncompliant| DEVOBJ
    DEVOBJ --> CAP
    MFA --> CAP
    CAP ==>|grant / block access to M365| DEV
    PIM -. protects .-> IntuneSvc

    classDef entra fill:#e8f0fe,stroke:#1a73e8,color:#111;
    classDef intune fill:#eafbea,stroke:#137333,color:#111;
    class U,G,DEVOBJ,CAP,MFA,PIM entra;
    class ENR,CFG,COMP,APPS intune;
```

**Legend.** The **enforcement loop**: Intune compliance → device object state in Entra → Conditional Access decision. Group **targeting** flows from Entra dynamic groups into Intune policy/app assignment. **MFA, risk-based CA, and PIM require Entra ID P2.**
Verified basis: [Require managed devices with Conditional Access](https://learn.microsoft.com/entra/identity/conditional-access/policy-all-users-device-compliance), [Intune planning guide — licensing](https://learn.microsoft.com/intune/fundamentals/planning-guide).

---

## 3. RBAC and scope tags architecture

```mermaid
graph TB
    subgraph EntraRoles["Entra roles (bypass scope tags) - PIM protected"]
        GA["Global Administrator"]
        IA["Intune Administrator"]
        SA["Security Administrator"]
    end

    subgraph Assignment["Intune role assignment = 3 levers"]
        ADMG["Admin Groups<br/>(who is admin)"]
        SCOPEG["Scope (Groups)<br/>(which users/devices managed)"]
        TAGS["Scope Tags<br/>(which tagged objects visible)"]
    end

    subgraph Roles["Intune built-in roles"]
        HD["Help Desk Operator"]
        AM["Application Manager"]
        ESM["Endpoint Security Manager"]
        RO["Read Only Operator"]
    end

    subgraph Objects["Tagged Intune objects"]
        O_EMEA["Policies/Apps/Devices<br/>tag = EMEA"]
        O_AMER["Policies/Apps/Devices<br/>tag = AMER"]
    end

    GA -->|setup + emergency only| IA
    IA -->|creates| TAGS
    ADMG --> HD
    ADMG --> AM
    ADMG --> ESM
    ADMG --> RO
    HD --> SCOPEG
    HD --> TAGS
    TAGS -->|EMEA| O_EMEA
    TAGS -->|AMER| O_AMER

    HD -. "EMEA helpdesk sees EMEA only" .-> O_EMEA
    ESM -. "central security sees all" .-> O_EMEA
    ESM -. "central security sees all" .-> O_AMER

    classDef warn fill:#fde7e9,stroke:#b3261e,color:#111;
    class GA warn;
```

**Legend.** Entra roles (red = highest privilege) ignore scope tags — minimize and PIM-protect them. Each **Intune role assignment** binds *Admin Groups* × *Scope (Groups)* × *Scope Tags*. Regional helpdesk is contained to its tag (`EMEA`); central security spans all. ⚠️ Permissions **merge** across multiple assignments — audit admins who hold more than one.
Verified basis: [Use RBAC and scope tags for distributed IT](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/scope-tags), [RBAC overview](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/overview).

---

## 4. Device enrollment and management workflow

```mermaid
flowchart TD
    START(["New / reset device"]) --> OWN{"Corporate or personal?"}

    OWN -->|Corporate| CTYPE{"Platform"}
    OWN -->|Personal / BYOD| BYOD{"Full MDM or MAM-only?"}

    CTYPE -->|Windows| AP["Windows Autopilot<br/>(Entra join / hybrid / pre-provision)"]
    CTYPE -->|Apple| ADE["Apple ADE via ABM<br/>(zero-touch)"]
    CTYPE -->|Android| AE["Android Enterprise<br/>fully managed / dedicated / COPE"]

    BYOD -->|Full MDM| UE["User enrollment via<br/>Company Portal"]
    BYOD -->|MAM-only| MAM["App Protection Policy<br/>(no enrollment)"]

    AP --> RESTR["Enrollment restrictions check<br/>(platform / limit)"]
    ADE --> RESTR
    AE --> RESTR
    UE --> RESTR

    RESTR -->|Blocked| DENY(["Enrollment denied"])
    RESTR -->|Allowed| MFA["Require MFA at enrollment (CA)"]
    MFA --> CERT["Intune installs MDM certificate<br/>+ Entra device object"]
    CERT --> ESP["Enrollment Status Page<br/>Device phase then User phase"]
    ESP --> POLICY["Apply config profiles, baselines,<br/>apps, compliance policy"]
    POLICY --> EVAL{"Compliant?"}

    EVAL -->|Yes| GRANT["Device marked compliant"]
    EVAL -->|No| REMED["User remediates<br/>(e.g., enable BitLocker)"]
    REMED --> EVAL

    GRANT --> CAeval["Conditional Access evaluates signal"]
    MAM --> CAeval
    CAeval -->|Pass| ACCESS(["Access to M365 resources"])
    CAeval -->|Fail| BLOCK(["Access blocked"])

    GRANT --> LIFE["Steady state: monitor,<br/>update rings, respond"]
    LIFE --> CLEAN{"Inactive > threshold?"}
    CLEAN -->|Yes| HIDE["Device cleanup rule hides record<br/>(no wipe) - Entra stale process separate"]
    CLEAN -->|No| LIFE
    LIFE --> RETIRE(["Retire (selective) / Wipe (full)"])

    classDef deny fill:#fde7e9,stroke:#b3261e,color:#111;
    class DENY,BLOCK deny;
```

**Legend.** Enrollment branches on **ownership → platform**. Restrictions are a non-security gate (✅ verified); real enforcement is **compliance + Conditional Access**. Autopilot/ADE give zero-touch corporate provisioning; BYOD prefers **MAM-only** where possible. Cleanup rules **hide** (not wipe) stale records; **retire** (selective) vs **wipe** (full) end the lifecycle.
Verified basis: [Enrollment guide](https://learn.microsoft.com/intune/device-enrollment/guide), [Enrollment restrictions](https://learn.microsoft.com/intune/device-enrollment/restrictions), [Set up the ESP](https://learn.microsoft.com/intune/device-enrollment/windows/setup-status-page), [Device cleanup rules](https://learn.microsoft.com/intune/governance/configure-cleanup-rules), [Device action: retire](https://learn.microsoft.com/intune/device-management/actions/retire).

---

## Rendering notes

- Diagrams use GitHub-compatible Mermaid. If a renderer chokes on special characters, note that labels intentionally avoid parentheses-only syntax conflicts by using `<br/>` and plain separators.
- These are **logical architecture views**, not literal screen flows. Implementation sequencing is owned by the respective downstream agents (2–7).

*Prepared by Agent 1 for the Ruflo orchestrator. Submitted for QA review (Agent 8).*
