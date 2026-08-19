# Data Collection Privacy & Consent Policy

## 1. Purpose

This document defines the privacy and consent requirements for collecting Indian Sign Language (ISL) gesture data from human signers as part of our custom MVP dataset.

## 2. Consent Requirement

**Every signer must provide informed consent BEFORE any data is collected.**

### What Consent Covers
- The signer understands they are contributing gesture data to a student research project
- The signer understands what data is being captured (see Section 3)
- The signer understands how their data will be used (see Section 4)
- The signer may withdraw consent and request deletion at any time (see Section 7)

### Consent Format
- Written consent form (digital or physical) signed by the signer
- For minors (under 18): parental/guardian consent required
- Consent form must be stored separately from the collected data

## 3. What Data Is Collected

| Data Type | Collected? | Stored? | Notes |
|-----------|-----------|---------|-------|
| MediaPipe hand landmarks (x,y,z × 21 points) | Yes | Yes | Primary training data |
| Signer ID (anonymized) | Yes | Yes | e.g., "signer_A", "signer_B" |
| Sign class label | Yes | Yes | Which ISL sign was performed |
| Session timestamp | Yes | Yes | For sample ordering/debugging |
| Recording conditions (lighting, device) | Yes | Yes | Metadata for quality control |
| Raw webcam video | Optional | Temporary | For verification only, deleted after landmark extraction unless signer explicitly consents to retention |
| Signer's real name | No | No | Not collected |
| Signer's face | No | No | MediaPipe Hands does not capture face data |
| Signer's location | No | No | Not collected |
| Signer's age/gender/demographics | Optional | If consented | For dataset diversity documentation only |

## 4. How Data Is Used

- Training, validating, and testing ISL recognition models
- Academic research and hackathon demonstration
- NOT sold, shared with third parties, or used for commercial purposes without explicit consent
- NOT used for biometric identification

## 5. Anonymization

- Signers are assigned opaque IDs: `signer_A`, `signer_B`, etc.
- No mapping from signer ID to real identity is stored digitally
- The consent form (which links real name to signer ID) is stored separately from the dataset, ideally in a locked physical or encrypted digital location

## 6. Data Storage

- Dataset files (CSV/JSON of landmarks) are stored in the project repository under `data/` directory
- Raw video (if retained with consent) is stored in a separate, access-controlled location
- Dataset is NOT uploaded to public repositories without review
- Access is limited to project team members

## 7. Deletion Procedure

If a signer requests deletion:
1. Identify all samples associated with their signer ID
2. Remove those samples from training, validation, and test sets
3. Delete any retained raw video
4. Re-train the model without their data
5. Confirm deletion to the signer in writing
6. Document the deletion in an audit log

## 8. Data Retention Period

- Landmark data: Retained for the duration of the project (academic year)
- Raw video: Deleted within 7 days of landmark extraction unless explicit extended consent is given
- After project conclusion: Team lead determines whether to archive or delete

## 9. Team Responsibilities

- **Data Controller:** Project team lead
- **Data Collection:** Any team member using the collection tool
- **Access Control:** Only team members with a legitimate need
- **Incident Response:** Any data breach or accidental exposure must be reported to the team lead immediately
