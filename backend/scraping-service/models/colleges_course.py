# colleges_course.py

class Courses:
    def __init__(self, name=None, description=None, duration=None, degree_level=None, seats=None,
                 annual_fees=None, entrance_exams=None, specializations=None):
        self.name = name or ""
        self.description = description or ""
        self.duration = duration or ""
        self.degree_level = degree_level or ""
        self.seats = seats if seats is not None else 0
        self.annual_fees = annual_fees if annual_fees is not None else 0
        self.entrance_exams = entrance_exams or []
        self.specializations = specializations or []
   


class College:
    def __init__(self, name=None, description=None, address=None, city=None, state=None, zip_code=None,
                 website=None, email=None, phone=None, scholarshipdetails=None, rating=None, type=None,
                 confidence=None, evidence_status=None, evidence_urls=None, courses=None):
        self.name = name or ""
        self.description = description or ""
        self.address = address or ""
        self.city = city or ""
        self.state = state or ""
        self.zip_code = zip_code or ""
        self.website = website or ""
        self.email = email or ""
        self.phone = phone or ""
        self.scholarshipdetails = scholarshipdetails or ""
        # Ensure rating is between 1.0 and 5.0
        self.rating = max(1.0, min(float(rating) if rating is not None else 1.0, 5.0))
        self.type = type
        # Confidence defaults to 0.0 if missing, clamped 0.0–1.0
        self.confidence = max(0.0, min(float(confidence) if confidence is not None else 0.0, 1.0))
        self.evidence_status = evidence_status or ""
        self.evidence_urls = evidence_urls or []
        self.courses = courses or []

    @property
    def overall_confidence(self):
        """Return confidence if available, else default to 0.0"""
        return self.confidence

    def to_dict(self):
        """Convert to dict (useful for insertion into DB)"""
        return {
            "name": self.name,
            "description": self.description,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip_code": self.zip_code,
            "website": self.website,
            "email": self.email,
            "phone": self.phone,
            "scholarshipdetails": self.scholarshipdetails,
            "rating": self.rating,
            "type": self.type,
            "confidence": self.confidence,
            "evidence_status": self.evidence_status,
            "evidence_urls": self.evidence_urls,
            "courses": [vars(c) for c in self.courses]
        }

