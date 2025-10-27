from fastapi import APIRouter, HTTPException
import database
import models
import schemas
import json
from typing import List, Optional

router = APIRouter(prefix="/api/aptitude", tags=["Aptitude"])

# All 50 questions data
SAMPLE_QUESTIONS = [
    {"question": "What is the main advantage of EV batteries over traditional gasoline engines?", "options": ["Faster acceleration", "Lower emissions", "Higher fuel efficiency", "Longer range"], "answer": "Lower emissions"},
    {"question": "Which material is commonly used in the production of EV batteries?", "options": ["Lithium", "Aluminum", "Iron", "Copper"], "answer": "Lithium"},
    {"question": "What is the primary component of an EV's powertrain?", "options": ["Battery", "Motor", "Transmission", "Fuel cell"], "answer": "Battery"},
    {"question": "What does the acronym 'EV' stand for?", "options": ["Electric Vehicle", "Enhanced Vehicle", "Eco Vehicle", "Energy Vehicle"], "answer": "Electric Vehicle"},
    {"question": "Which of these companies is known for manufacturing electric vehicles?", "options": ["Tesla", "Ford", "Chevrolet", "Toyota"], "answer": "Tesla"},
    {"question": "What is the typical voltage range for an EV battery?", "options": ["12V-24V", "36V-48V", "72V-96V", "300V-800V"], "answer": "300V-800V"},
    {"question": "What does a 'DC fast charger' do?", "options": ["Charges the battery slowly", "Provides a quick charge to the battery", "Discharges the battery", "Charges only at night"], "answer": "Provides a quick charge to the battery"},
    {"question": "Which technology is crucial for the efficiency of EV charging?", "options": ["Solar panels", "Wireless charging", "Regenerative braking", "Active cooling systems"], "answer": "Regenerative braking"},
    {"question": "Which part of an EV is responsible for regenerative braking?", "options": ["Battery", "Motor", "Chassis", "Inverter"], "answer": "Motor"},
    {"question": "Which is a key challenge in the EV battery supply chain?", "options": ["Battery disposal", "Limited raw materials", "Lack of charging stations", "Overproduction of batteries"], "answer": "Limited raw materials"},
    {"question": "How long does it typically take for a fast charger to fully charge an EV?", "options": ["30 minutes", "1 hour", "2 hours", "8 hours"], "answer": "30 minutes"},
    {"question": "What is one major environmental benefit of electric vehicles?", "options": ["Reduced air pollution", "Lower manufacturing cost", "More jobs in fossil fuel industries", "Increased traffic congestion"], "answer": "Reduced air pollution"},
    {"question": "What is a key consideration when designing an EV for mass-market production?", "options": ["Range and charging time", "Color options", "Sound system", "Tire design"], "answer": "Range and charging time"},
    {"question": "What type of motor is most commonly used in electric vehicles?", "options": ["AC induction motor", "DC brushed motor", "Brushless DC motor", "Synchronous motor"], "answer": "AC induction motor"},
    {"question": "What is one major advantage of using lithium-ion batteries in EVs?", "options": ["Low cost", "High energy density", "Ease of recycling", "High voltage tolerance"], "answer": "High energy density"},
    {"question": "Which factor affects the efficiency of an EV's battery?", "options": ["Battery temperature", "Vehicle color", "Type of tires", "Length of charging cable"], "answer": "Battery temperature"},
    {"question": "Which of these is not a common challenge for EV adoption?", "options": ["Battery cost", "Charging infrastructure", "Long refueling times", "Consumer awareness"], "answer": "Long refueling times"},
    {"question": "What is the primary function of the inverter in an EV?", "options": ["Convert AC to DC", "Convert DC to AC", "Control charging speed", "Store energy"], "answer": "Convert DC to AC"},
    {"question": "How does regenerative braking contribute to EV efficiency?", "options": ["By using wind power", "By converting kinetic energy into electrical energy", "By cooling the battery", "By reducing tire wear"], "answer": "By converting kinetic energy into electrical energy"},
    {"question": "What is the main purpose of the electric vehicle control unit (VCU)?", "options": ["Manage the battery charging cycle", "Monitor tire pressure", "Control the electric motor and power distribution", "Cool the motor"], "answer": "Control the electric motor and power distribution"},
    {"question": "What is one common advantage of EVs over traditional vehicles?", "options": ["More expensive to maintain", "Silent operation", "Higher maintenance cost", "Dependence on gasoline"], "answer": "Silent operation"},
    {"question": "What does 'range anxiety' refer to?", "options": ["Fear of running out of charge before reaching a destination", "Fear of the vehicle being too large", "Fear of high fuel costs", "Fear of the battery being too large"], "answer": "Fear of running out of charge before reaching a destination"},
    {"question": "Which is a key feature of a solid-state battery?", "options": ["Low energy density", "Fast charging time", "Increased risk of fire", "No liquid electrolyte"], "answer": "No liquid electrolyte"},
    {"question": "What role does the battery management system (BMS) play in an EV?", "options": ["Manages battery charging and discharging", "Controls the electric motor speed", "Regulates tire pressure", "Increases battery size"], "answer": "Manages battery charging and discharging"},
    {"question": "What is a major advantage of using solid-state batteries in electric vehicles?", "options": ["Lower cost", "Higher energy density", "Slower charging times", "Higher risk of overheating"], "answer": "Higher energy density"},
    {"question": "Which company is known for developing the first commercially successful electric vehicle?", "options": ["Nissan", "Tesla", "Chevrolet", "BMW"], "answer": "Tesla"},
    {"question": "How does EV adoption help reduce global greenhouse gas emissions?", "options": ["By increasing electricity demand", "By reducing dependence on fossil fuels", "By increasing fuel consumption", "By promoting coal energy use"], "answer": "By reducing dependence on fossil fuels"},
    {"question": "What is the main disadvantage of using an electric vehicle?", "options": ["Limited range", "High cost of charging stations", "Availability of fuel", "Lack of electric motors"], "answer": "Limited range"},
    {"question": "Which company is leading the development of autonomous EV technology?", "options": ["Google", "Apple", "Tesla", "General Motors"], "answer": "Tesla"},
    {"question": "Which of these is not a type of EV charger?", "options": ["Level 1", "Level 2", "Level 3", "Supercharger"], "answer": "Supercharger"},
    {"question": "What is the typical lifespan of an EV battery?", "options": ["5-7 years", "10-15 years", "20-25 years", "30-35 years"], "answer": "10-15 years"},
    {"question": "Which is a key advantage of an electric vehicle over a hybrid vehicle?", "options": ["Better fuel efficiency", "Zero tailpipe emissions", "More horsepower", "Cheaper maintenance"], "answer": "Zero tailpipe emissions"},
    {"question": "What does a hybrid electric vehicle (HEV) use in addition to an electric motor?", "options": ["A diesel engine", "A gasoline engine", "A hydrogen fuel cell", "A supercharger"], "answer": "A gasoline engine"},
    {"question": "What is the main benefit of vehicle-to-grid (V2G) technology?", "options": ["Increased battery life", "Bidirectional energy flow between EVs and the grid", "Faster charging", "Lower vehicle weight"], "answer": "Bidirectional energy flow between EVs and the grid"},
    {"question": "What is the primary function of the power electronics module (PEM) in an EV?", "options": ["Control charging cycles", "Manage battery storage", "Convert energy between AC and DC", "Monitor tire pressure"], "answer": "Convert energy between AC and DC"},
    {"question": "What is one advantage of a fast-charging station for electric vehicles?", "options": ["Reduces the need for power distribution", "Allows for charging within 30 minutes or less", "Increases battery degradation", "Requires no infrastructure"], "answer": "Allows for charging within 30 minutes or less"},
    {"question": "What is a major component of the EV charging infrastructure?", "options": ["Solar panels", "Wind turbines", "Charging stations", "Electric grids"], "answer": "Charging stations"},
    {"question": "Which is an emerging technology in the field of electric vehicle charging?", "options": ["Wireless charging", "Hydrogen fuel cells", "Petrol charging stations", "Overhead cable charging"], "answer": "Wireless charging"},
    {"question": "What is the main reason to adopt electric vehicles in public transport systems?", "options": ["Lower operational costs", "Faster passenger service", "Higher energy consumption", "Less frequent charging stations"], "answer": "Lower operational costs"},
    {"question": "Which renewable energy source is commonly used to charge electric vehicles?", "options": ["Solar energy", "Wind energy", "Hydropower", "Geothermal"], "answer": "Solar energy"},
    {"question": "What component in an EV ensures safety during battery operation?", "options": ["Cooling system", "Battery Management System (BMS)", "Electric motor", "Transmission"], "answer": "Battery Management System (BMS)"},
    {"question": "Which government policy can encourage EV adoption?", "options": ["Fuel tax increase", "Subsidies for EV purchases", "Banning solar panels", "Raising toll taxes"], "answer": "Subsidies for EV purchases"},
    {"question": "What is the function of an EV's thermal management system?", "options": ["Improve sound quality", "Enhance acceleration", "Regulate battery and motor temperature", "Increase top speed"], "answer": "Regulate battery and motor temperature"},
    {"question": "What type of maintenance do EVs generally require less of compared to ICE vehicles?", "options": ["Battery replacement", "Brake pad replacement", "Oil changes", "Tire rotation"], "answer": "Oil changes"},
    {"question": "Which of the following is NOT a type of electric vehicle?", "options": ["Battery Electric Vehicle (BEV)", "Plug-in Hybrid Electric Vehicle (PHEV)", "Internal Combustion Engine Vehicle (ICEV)", "Hybrid Electric Vehicle (HEV)"], "answer": "Internal Combustion Engine Vehicle (ICEV)"},
    {"question": "What determines the charging speed of an EV?", "options": ["Size of tires", "Type of charger and battery capacity", "Color of vehicle", "Length of trip"], "answer": "Type of charger and battery capacity"},
    {"question": "Which country has the highest EV adoption rate as of recent years?", "options": ["USA", "China", "Norway", "Germany"], "answer": "Norway"},
    {"question": "How does an EV contribute to quieter cities?", "options": ["They use special soundproof tires", "They generate less engine noise", "They are driven only during the day", "They run on solar power only"], "answer": "They generate less engine noise"},
    {"question": "What safety concern is associated with EV battery packs?", "options": ["High flammability", "Overheating and thermal runaway", "Water leakage", "Brake failure"], "answer": "Overheating and thermal runaway"},
    {"question": "What is one way EVs support smart grid systems?", "options": ["By using more electricity", "By storing excess renewable energy", "By using gasoline as backup", "By powering other vehicles"], "answer": "By storing excess renewable energy"}
]

async def seed_initial_questions():
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if questions already exist
        cursor.execute("SELECT COUNT(*) as count FROM aptitude_questions")
        result = cursor.fetchone()
        
        if result['count'] == 0:
            # Insert all 50 questions
            for question in SAMPLE_QUESTIONS:
                cursor.execute("""
                    INSERT INTO aptitude_questions (question, options, answer, category, difficulty)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    question["question"],
                    json.dumps(question["options"]),
                    question["answer"],
                    "General",
                    "Medium"
                ))
            
            conn.commit()
            print(f"✅ Seeded {len(SAMPLE_QUESTIONS)} initial questions")
        
    except Exception as e:
        print(f"Error seeding questions: {e}")
    finally:
        cursor.close()

@router.get("/")
async def get_questions(category: Optional[str] = None, difficulty: Optional[str] = None):
    try:
        # Seed questions if empty
        await seed_initial_questions()
        
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT * FROM aptitude_questions WHERE is_active = TRUE"
        params = []
        
        if category:
            query += " AND category = %s"
            params.append(category)
        
        if difficulty:
            query += " AND difficulty = %s"
            params.append(difficulty)
        
        # Remove ORDER BY RAND() to get all questions in consistent order
        query += " ORDER BY id"
        
        cursor.execute(query, params)
        questions = cursor.fetchall()
        
        # Parse JSON options
        for question in questions:
            question['options'] = json.loads(question['options'])
        
        print(f"✅ Fetched {len(questions)} questions from database")
        return questions
        
    except Exception as e:
        print(f"Error fetching questions: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()

@router.post("/bulk")
async def bulk_insert_questions(questions: List[models.AptitudeQuestionCreate]):
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        inserted_count = 0
        duplicates = 0
        
        for question in questions:
            # Check if question already exists
            cursor.execute("SELECT id FROM aptitude_questions WHERE question = %s", (question.question,))
            existing = cursor.fetchone()
            
            if not existing:
                # Insert new question
                cursor.execute("""
                    INSERT INTO aptitude_questions (question, options, answer, category, difficulty)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    question.question,
                    json.dumps(question.options),
                    question.answer,
                    question.category,
                    question.difficulty
                ))
                inserted_count += 1
            else:
                duplicates += 1
        
        conn.commit()
        
        return schemas.BulkInsertResponse(
            message=f"Successfully inserted {inserted_count} questions",
            inserted_count=inserted_count,
            duplicates=duplicates
        )
        
    except Exception as e:
        print(f"Error in bulk insert: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()

@router.post("/submit-test")
async def submit_test_result(test_data: schemas.TestSubmission):
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO test_results (email, questions, selected_answers, score, total_questions, percentage, time_spent)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            test_data.email,
            json.dumps(test_data.questions),
            json.dumps(test_data.selected_answers),
            test_data.score,
            test_data.total_questions,
            test_data.percentage,
            test_data.time_spent
        ))
        
        conn.commit()
        result_id = cursor.lastrowid
        
        return {
            "message": "Test result saved successfully",
            "result_id": result_id
        }
        
    except Exception as e:
        print(f"Error saving test result: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()

@router.get("/results")
async def get_test_results(email: Optional[str] = None):
    try:
        conn = database.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        if email:
            cursor.execute("SELECT * FROM test_results WHERE email = %s ORDER BY test_date DESC", (email,))
        else:
            cursor.execute("SELECT * FROM test_results ORDER BY test_date DESC")
        
        results = cursor.fetchall()
        
        # Parse JSON fields
        for result in results:
            result['questions'] = json.loads(result['questions'])
            result['selected_answers'] = json.loads(result['selected_answers'])
        
        return {"results": results}
        
    except Exception as e:
        print(f"Error fetching test results: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()