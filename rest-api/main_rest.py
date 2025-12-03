from app import app
from flask import jsonify, flash, request, session, send_file, abort, current_app
from supabase import create_client, Client

SUPABASE_URL = 'https://czqyykcerlzhmrsfdfmq.supabase.co';
SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cXl5a2Nlcmx6aG1yc2ZkZm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDg5NjgsImV4cCI6MjA3NTc4NDk2OH0.2QOLg_5_gHsHlEkLjgFmLoxfQGeHK4Iuo13am5qZB3Y'

@app.route('/search/colleges', methods=['GET'])
def search_colleges():
    try:
        query = request.args.get('q', '').strip()
        print("Received query:", query)
        if not query:
            return jsonify({"data": []}), 200

        
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

        # Fetch all colleges first (or you can fetch top 1000)
        all_colleges = supabase.table("st_college").select("*").execute().data

        # Split query into words
        words = query.lower().split()

        def matches(college):
            text = f"{college.get('name','')} {college.get('description','')} {college.get('city','')} {college.get('state','')}".lower()
            return all(word in text for word in words)  # all words must be present somewhere

        filtered_colleges = [c for c in all_colleges if matches(c)]

        print("Filtered colleges:", filtered_colleges)
        return jsonify({"data": filtered_colleges}), 200

    except Exception as e:
        print("Search error ?", e)
        return jsonify({"error": str(e)}), 500

@app.route("/search/careerpath", methods=["GET"])
def search_careerpath():
    try:
        query = request.args.get("q", "").strip().lower()
        if not query:
            return jsonify({"data": []}), 200

        
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

        # Fetch all career paths
        all_paths = supabase.table("career_path").select("*").execute().data or []

        # Filter manually
        filtered_paths = [
            path for path in all_paths
            if query in (path.get("name", "").lower() + path.get("description", "").lower())
        ]

        return jsonify({"data": filtered_paths}), 200

    except Exception as e:
        print("Career path search error ?", e)
        return jsonify({"error": str(e)}), 500

@app.route("/courses/similarity/<college_id>", methods=["GET"])
def check_course_similarity(college_id):
    try:
        # Step 1: Get st_course IDs linked to this college
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
        mapping_res = supabase.table("st_college_courses").select("course_id").eq("college_id", college_id).execute()
        st_course_ids = [m["course_id"] for m in mapping_res.data or []]

        if not st_course_ids:
            return jsonify({"data": []}), 200

        # Step 2: Fetch st_courses
        st_courses_res = supabase.table("st_course").select("*").in_("id", st_course_ids).execute()
        st_courses = st_courses_res.data or []

        # Step 3: Fetch all courses from main course table
        courses_res = supabase.table("course").select("*").execute()
        courses = courses_res.data or []

        result = []

        for st_course in st_courses:
            best_match = None
            best_score = 0
            st_name = st_course["name"]

            for course in courses:
                course_name = course["name"]
                embedding1 = model.encode(st_name, convert_to_tensor=True)
                embedding2 = model.encode(course_name, convert_to_tensor=True)
                score = util.cos_sim(embedding1, embedding2).item() * 100  # %

                if score > best_score:
                    best_score = score
                    best_match = course

            result.append({
                "st_course_id": st_course["id"],
                "st_course_name": st_course["name"],
                "best_match_id": best_match["id"] if best_score >= 80 else None,
                "best_match_name": best_match["name"] if best_score >= 80 else None,
                "similarity": best_score
            })

        return jsonify({"data": result}), 200

    except Exception as e:
        print("Similarity check error ?", e)
        return jsonify({"error": str(e)}), 500

@app.route('/approve', methods=['POST'])
def approve():
    try:
        
        data = request.get_json()
        pid = data.get('id')

      
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
        colleges = supabase.table("st_college").select("*").eq("id", pid).execute().data

        print(colleges)
        for c in colleges:
            name = c["name"].strip()
            id = c["id"].strip()

            print(name)
            record = {"name": name, "description":c["description"], "address":c["address"], "city":c["city"], "state":c["state"], "zip_code":c["zip_code"], "website": c["website"], "email":c["email"], "phone": c["phone"], "scholarshipdetails": c["scholarshipdetails"], "rating": c["rating"] ,"type": c["type"]}

            res = supabase.table("college").upsert(record, on_conflict="name").execute()
            new_id = res.data[0]["id"]
            prod_college_id = new_id
            print("college id", prod_college_id)
            st_college_courses = (
                supabase.table("st_college_courses")
                .select("*")
                .eq("college_id", id)
               .execute()
              .data
             )
            print("Mapping", st_college_courses)
            for mapping in st_college_courses:
                course_id = mapping["course_id"]
                # Fetch the course details from staging
                st_course = (
                  supabase.table("st_course")
                 .select("*")
                 .eq("id", course_id)
                 .single()
                 .execute()
                 .data
               )
                if not st_course:
                    return 

                # Upsert into production course table
                res_course=supabase.table("course").upsert(
                {
                 "name": st_course["name"],
                 "description":st_course["description"],
                 "duration": st_course.get("duration"),
                 "degree_level": st_course.get("level"),
                 "seats": st_course.get("seats"),
                 "annual_fees": st_course.get("annual_fees")

       		}, on_conflict="name"
    		).execute()
                prod_course_id=res_course.data[0]["id"]
                print("course id", prod_course_id)
               # Step 5: Create mapping (college_course)
                if prod_course_id:
                    supabase.table("college_courses").upsert(
                    {
                  "college_id": prod_college_id,
                   "course_id": prod_course_id
                 }, on_conflict="college_id,course_id"
                ).execute()
                 # Step 6: Delete from Staging
                print("Delete from college courses")
                response = supabase.table("st_college_courses").delete().eq("course_id", course_id).execute()
                response = supabase.table("st_course").delete().eq("id", course_id).execute()
            response = supabase.table("st_college").delete().eq("id", id).execute()
            print("Done", st_course["name"])

        return jsonify({"success": "success"}), 200
    except Exception as e:
        print("Exception", e)
        return jsonify({"error": str(e)}), 500




if __name__ == "__main__":
    app.run(port=5000, host='127.0.0.1')