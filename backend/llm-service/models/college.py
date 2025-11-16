from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class VerificationStatus(Enum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    REJECTED = "rejected"

class EvidenceStatus(Enum):
    PENDING_VERIFICATION = "pending_verification"
    VERIFIED = "verified"
    PARTIALLY_VERIFIED = "partially_verified"
    NO_EVIDENCE_FOUND = "no_evidence_found"

@dataclass
class Course:
    """Course model"""
    name: str
    description: Optional[str] = None
    duration: str = "Not specified"
    degree_level: str = "UG"
    seats: Optional[int] = None
    annual_fees: Optional[float] = None
    
    # Additional metadata (not in staging table, used for processing)
    official_source_url: str = ""
    row_confidence: float = 0.7
    entrance_exams: List[str] = field(default_factory=list)
    specializations: List[str] = field(default_factory=list)
    evidence_urls: List[str] = field(default_factory=list)

    # Backward compatibility
    @property
    def course_name(self) -> str:
        return self.name
    

@dataclass
class College:
    """College model"""
    name: str
    description: str = ""
    address: str = ""
    city: str = ""
    state: str = ""
    zip_code: str = ""
    website: str = ""
    email: str = ""
    email: str = ""
    phone: str = ""
    scholarshipdetails: str = ""
    rating: float = 3.5 # from 1.0 to  5.0
    type: str = "private" # government, private, deemed, central, state

    # Confidence and validation details
    overall_confidence: float = 0.5
    confidence_level: str = "MEDIUM" # HIGH, MEDIUM, LOW, VERY_LOW
    evidence_status: EvidenceStatus = EvidenceStatus.PENDING_VERIFICATION
    evidence_urls: List[str] = field(default_factory=list)

    # Course data
    courses: List[Course] = field(default_factory=list)

    # Metadata (not in staging table, used for processing)
    last_collected: datetime = field(default_factory=datetime.now)
    verification_status: VerificationStatus = VerificationStatus.DRAFT
    validation_details: dict = field(default_factory=dict)

    def __post_init__(self):
        """Ensure type is lowercase for database consistency"""
        if self.type:
            self.type = self.type.lower()

        # Calculate confidence level if not set
        if not self.confidence_level or self.confidence_level == "MEDIUM":
            if self.overall_confidence >= 0.8:
                return "HIGH"
            elif self.overall_confidence >= 0.6:
                return "MEDIUM"
            elif self.overall_confidence >= 0.4:
                return "LOW"
            else:
                return "VERY_LOW"
    
    def _calculate_confidence_level(self) -> str:
        """Calculate confidence level based on overall_confidence score"""
        if self.overall_confidence >= 0.8:
            return "HIGH"
        elif self.overall_confidence >= 0.6:
            return "MEDIUM"
        elif self.overall_confidence >= 0.4:
            return "LOW"
        else:
            return "VERY_LOW"
    
    def to_dict(self) -> dict:
        """Convert college to dictionary for database insertion"""
        return {
            'name': self.name,
            'description': self.description,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'website': self.website,
            'email': self.email,
            'phone': self.phone,
            'scholarshipdetails': self.scholarshipdetails,
            'rating': round(float(self.rating), 1),
            'type': self.type.lower(),
            'confidence': round(float(self.overall_confidence), 2),
            'confidence_level': self.confidence_level,
            'evidence_status': self.evidence_status.value if hasattr(self.evidence_status, 'value') else str(self.evidence_status),
            'evidence_urls': ', '.join(self.evidence_urls[:5]) if self.evidence_urls else ""
        }
    
    def get_summary(self) -> str:
        """Get summary statistics for this college"""
        return {
            'name': self.name,
            'location': f"{self.city}, {self.state}",
            'type': self.type,
            'total_courses': len(self.courses),
            'confidence': self.overall_confidence,
            'confidence_level': self.confidence_level,
            'evidence_status': str(self.evidence_status.value if hasattr(self.evidence_status, 'value') else self.evidence_status),
            'website_accessible': self.validation_details.get('website_accessible', False) if self.validation_details else False,
            'govt_verified': self.validation_details.get('govt_verified', False) if self.validation_details else False
        }
