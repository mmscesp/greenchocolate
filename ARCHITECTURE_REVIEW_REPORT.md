# Comprehensive Architecture & Design Review Report
## Cannabis Social Club Platform

**Review Date:** 2026-02-01  
**Focus Areas:** Robustness, Privacy, Speed  
**Status:** CRITICAL GAPS IDENTIFIED

---

## Executive Summary

The documentation suite demonstrates strong foundational thinking around privacy (Application-Level Encryption, "The Burn" system) and user experience. However, **significant gaps exist** that create legal, operational, and performance risks. The platform is currently **NOT PRODUCTION-READY** without addressing critical GDPR compliance issues, robustness failures, and performance bottlenecks.

**Risk Level Assessment:**
- 🔴 **CRITICAL (Legal/Security Risk):** 12 items
- 🟡 **MODERATE (Operational Risk):** 15 items  
- 🟢 **MISSING DETAILS:** 18 items

---

## 1. CRITICAL GAPS (Must Fix Before Launch)

### 1.1 Privacy & GDPR Compliance 🔴

| # | Issue | Location | Risk |
|---|-------|----------|------|
| 1 | **No Data Retention Policy** (GDPR Art. 5) | All docs | Fines up to €20M |
| 2 | **Missing Consent Management** (GDPR Art. 7) | PRD.md Sec 3.2 | Invalid legal basis |
| 3 | **Cross-Border Transfer Non-Compliance** (Art. 44-49) | SYSTEM_ARCH.md Sec 1 | Illegal EU→US data flow |
| 4 | **No Breach Notification Protocol** (Art. 33) | SECURITY.md | 72h deadline violation |
| 5 | **Excessive Data Collection** ("Smoking Habits") | PRD.md Sec 3.2 | Data minimization violation |
| 6 | **Nationality Stored as Public** | BACKEND_ARCH.md Sec 2.1 | Profiling risk |

**Immediate Actions Required:**
1. Define retention periods: PII (2 years), Logs (1 year), Backups (30 days)
2. Implement consent workflow with withdrawal mechanism
3. Add SCCs (Standard Contractual Clauses) for US providers
4. Create breach response runbook with notification templates

### 1.2 Security Vulnerabilities 🔴

| # | Issue | Location | Risk |
|---|-------|----------|------|
| 1 | **Single Master Encryption Key** | SECURITY.md Sec 3.2 | All data exposed if key leaks |
| 2 | **No MFA for Admin Roles** | PRD.md Sec 4.2 | Account takeover risk |
| 3 | **Audit Logs in Same DB** | BACKEND_ARCH.md Sec 3.3 | Tampering possible |
| 4 | **Weak Club Verification** | PRD.md Sec 3.4 | Social engineering attacks |
| 5 | **No Rate Limiting** | SYSTEM_ARCH.md Sec 4 | DoS/Brute force vulnerability |

**Oracle Recommendation:**
> Implement **Envelope Encryption** with per-user DEKs (Data Encryption Keys). Store encrypted DEK in DB, decrypt with master KEK. This enables true crypto-shredding.

### 1.3 Robustness Failures 🔴

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 1 | **Supabase SPOF** | SYSTEM_ARCH.md Sec 1 | Total outage if suspended |
| 2 | **No Circuit Breakers** | BACKEND_ARCH.md Sec 3.2 | Cascading failures |
| 3 | **Incomplete DR Strategy** | INFRASTRUCTURE.md Sec 4 | Data loss risk |
| 4 | **Undefined Error Handling** | MASTER_PLAN.md | Poor UX during failures |

### 1.4 Performance Bottlenecks 🔴

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 1 | **4K Hero Video** | DESIGN_SYSTEM.md Sec 4.1 | LCP >5s, data overages |
| 2 | **Heavy Mapbox Loading** | DESIGN_SYSTEM.md Sec 5 | TBT degradation |
| 3 | **No Code Splitting Strategy** | FRONTEND_ARCH.md Sec 2 | Large bundle size |

---

## 2. MODERATE GAPS (Fix for Production)

### 2.1 Design System Incompleteness 🟡

**Missing from DESIGN_SYSTEM.md:**
- WCAG compliance targets (contrast ratios)
- Responsive breakpoints strategy
- `prefers-reduced-motion` support
- Typography scale (sizes, line-heights)
- Spacing design tokens
- Animation timing/easing standards
- Z-index scale for overlays
- Component states (loading, error, empty)
- Form validation patterns

### 2.2 Architecture Hardening 🟡

**From SYSTEM_ARCHITECTURE.md:**
- Shallow health checks (need deep checks)
- No performance budgets defined
- Unclear cache invalidation strategy
- Missing indexing strategy for DB

**From INFRASTRUCTURE.md:**
- No cold start mitigation
- Unclear edge caching for dynamic content
- Missing log levels (Error only → need Warning/Info)

### 2.3 Privacy Best Practices 🟡

- No Record of Processing Activities (ROPA)
- Missing Privacy Policy integration points
- Sub-processor list incomplete
- Image EXIF metadata not stripped
- Regex content filtering bypassable

---

## 3. MISSING IMPLEMENTATION DETAILS 🟢

### 3.1 Security
- [ ] RLS SQL for complex "approved" access joins
- [ ] Per-user salt rotation procedure
- [ ] Session invalidation on security events
- [ ] CSP directives for Supabase/Mapbox
- [ ] Club image virus scanning pipeline

### 3.2 Performance
- [ ] Video compression specifications
- [ ] Lazy loading implementation for maps
- [ ] TanStack Query global config (staleTime/gcTime)
- [ ] Font loading strategy (display: swap)
- [ ] Pagination/virtualization for large lists

### 3.3 Operations
- [ ] RTO/RPO definitions
- [ ] Deep health check specifications
- [ ] Rate limiting thresholds
- [ ] Backup restoration procedures
- [ ] Migration rollback strategy

---

## 4. Oracle Architecture Assessment

### Key Recommendations:

**1. Key Management Redesign (CRITICAL)**
- Current: Single `DATA_ENCRYPTION_KEY` in env vars
- Recommended: Envelope Encryption with per-user DEKs
- Benefit: True crypto-shredding, key rotation without re-encryption

**2. Platform Risk Mitigation (HIGH)**
- Risk: Netlify/Supabase US-based, cannabis AUP violations
- Recommendation: 
  - Containerize app for VPS portability (Hetzner/Njalla)
  - Daily pg_dump backups to neutral provider (Wasabi/Swiss)
  - Build for Docker from day one

**3. "Blind Endorsements" Enhancement**
- Current: Simple deletion of invite links
- Better: Zero-knowledge proof or Bloom Filter
- Simple Alternative: Hash("Lineage Path") for fraud detection without identity

**4. Caching Strategy Correction**
- Issue: Membership requests should NEVER be cached
- Fix: Use `export const dynamic = 'force-dynamic'` for transactional routes

---

## 5. Simplified Priority Matrix

### Phase 1: Legal Compliance (Week 1)
- [ ] Define data retention policy
- [ ] Design consent management workflow
- [ ] Add SCCs for cross-border transfer
- [ ] Create breach notification protocol

### Phase 2: Security Hardening (Week 2)
- [ ] Implement envelope encryption
- [ ] Add MFA for admin roles
- [ ] Set up rate limiting
- [ ] Externalize audit logs

### Phase 3: Robustness (Week 3)
- [ ] Containerize for VPS portability
- [ ] Set up automated backups
- [ ] Implement circuit breakers
- [ ] Define error handling patterns

### Phase 4: Performance (Week 4)
- [ ] Optimize hero video (lazy loading, compression)
- [ ] Code-split Mapbox component
- [ ] Define performance budgets
- [ ] Add TanStack Query config

---

## 6. Document-Specific Action Items

### DESIGN_SYSTEM.md
**CRITICAL:**
- Add WCAG 2.1 AA compliance section
- Define responsive breakpoints (mobile-first)
- Add `prefers-reduced-motion` support

**MODERATE:**
- Document typography scale (text-xs to text-9xl)
- Define spacing tokens (4px/8px grid)
- Add animation timing standards
- Document component states

### SYSTEM_ARCHITECTURE.md
**CRITICAL:**
- Add data residency section (GDPR Art. 44)
- Document cross-border transfer mechanism (SCCs)
- Define retention policies per data type

**MODERATE:**
- Consolidate caching TTLs into single table
- Add database indexing strategy
- Define performance budgets

### SECURITY.md
**CRITICAL:**
- Add breach notification procedure
- Redesign key management (envelope encryption)
- Document consent management

**MODERATE:**
- Add ROPA (Record of Processing Activities)
- Document sub-processor list
- Add image EXIF stripping procedure

---

## 7. Conclusion

The platform has a **solid privacy foundation** but requires significant hardening before production. The most urgent issues are:

1. **GDPR Compliance** - Legal risk, must address retention & consent
2. **Key Management** - Security risk, implement envelope encryption  
3. **Platform Risk** - Operational risk, containerize for portability
4. **Performance** - UX risk, optimize video and maps

**Estimated Effort:** 3-4 weeks of focused work to reach production readiness.

**Recommended Next Step:** Begin with legal compliance (data retention + consent) as these are foundational to all other work.

---

*Report compiled from analysis by 5 specialized agents + Oracle consultation*  
*All findings mapped to specific document sections for easy reference*
