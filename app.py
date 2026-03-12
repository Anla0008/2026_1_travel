from flask import Flask, render_template, request, jsonify, session, redirect
import x
import uuid # 36 tal med bindestreg, 32 uden bindestreg 
import time
from flask_session import Session
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
 
from icecream import ic
ic.configureOutput(prefix=f'----- | ', includeContext=True)
 
app = Flask(__name__)
 
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)


# get       /users
# get       /users/1
# post      /users
# patch     /users/1
# delete    /users/1

# post      /api-create-user      -best pracis 
# post      /acu




#-------------SIGNUP-------------#
@app.get("/signup")
def show_signup():
    try:
        user = session.get("user", "")
        return render_template ("page_signup.html", user=user, x=x)
    except Exception as ex:
        ic(ex)
        return "Hovsa"

#-------------ROUTE-------------#
@app.post("/api-create-user")
def api_create_user():
    try:
        user_first_name = x.validate_user_first_name()
        user_last_name = x.validate_user_last_name()
        user_email = x.validate_user_email()
        user_password = x.validate_user_password()

        user_hashed_password = generate_password_hash(user_password)

        # ic (user_hashed_password) -dette er en has'et kode: "scrypt:32768:8:1$IeGrT1fg2X4x5mDp$ad3885cd4f464f82143bf37d88163130f585a581916981497f857a9269e6270b5cb3464aade040dfc20a570d58ad439321aa2ed86f41be880e0a7843ff79f15c"
        
        user_pk = uuid.uuid4().hex

        user_created_at = int(time.time())


        db, cursor =x.db()
        q = "INSERT INTO users VALUES(%s, %s, %s, %s, %s, %s)"
        cursor.execute(q,(user_pk, user_first_name, user_last_name, user_email, user_hashed_password, user_created_at))
        db.commit()

        form_signup = render_template("___form_signup.html", x=x)

        return f""" 
        <browser mix-replace="form">{form_signup}</browser>
        <browser mix-redirect="/login"></browser>
        """

    except Exception as ex:
        ic(ex)
        
        #------------First name------------#
        if "company_exception user_first_name" in str(ex):
            error_message = f"user first name {x.USER_FIRST_NAME_MIN} to {x.USER_FIRST_NAME_MAX} characters"
            ___tip = render_template("___tip.html", status="error", message = error_message)
            return f"""
            <browser mix-after-begin ="#tooltip">{___tip}</browser>
            """, 400

        #------------Last name------------#
        if "company_exception user_last_name" in str(ex):
            error_message = f"user last name {x.USER_LAST_NAME_MIN} to {x.USER_LAST_NAME_MAX} characters"
            ___tip = render_template("___tip.html", status="error", message = error_message)
            return f"""
            <browser mix-after-begin ="#tooltip">{___tip}</browser>
            """, 400

        #------------Email------------#
        if "company_exception user_email" in str(ex):
            error_message = f"user email invalid"
            ___tip = render_template("___tip.html", status="error", message = error_message)
            return f"""
            <browser mix-after-begin ="#tooltip">{___tip}</browser>
            """, 400

        #------------Password------------#
        if "company_exception user_password" in str(ex):
            error_message = f"user password {x.USER_PASSWORD_MIN} to {x.USER_PASSWORD_MAX} characters"
            ___tip = render_template("___tip.html", status="error", message = error_message)
            return f"""
            <browser mix-after-begin ="#tooltip">{___tip}</browser>
            """, 400

        #------------Duplicate Email------------#
        if "Duplicate entry" in str(ex) and "user_email" in str(ex):
            error_message = "Email already in the system"
            ___tip = render_template("___tip.html", status="error", message = error_message)
            return f"""<browser mix-after-begin ="#tooltip">{___tip}</browser>""", 400


        # Worst case
        error_message = "System under maintenance"
        ___tip = render_template("___tip.html", status="error", message = error_message)
        return f"""<browser mix-after-begin ="#tooltip">{___tip}</browser>""", 400
    
    finally:
        if "cursor" in locals(): cursor.close() # locals referere til alt i "try" og "except", pr. funktion.
        if "db" in locals(): db.close()  

#-------------LOGIN-------------#
@app.get("/login")
@x.no_cache
def show_login():
    try:
        user = session.get("user", "")
        if not user:
            return render_template ("page_login.html", user=user, x=x)
        return redirect ("/profile")
    except Exception as ex:
        ic(ex)
        return "Hovsa"

#-------------ROUTE-------------#
@app.post("/api-login")
def api_login():
    try:
        user_email = x.validate_user_email()
        user_password = x.validate_user_password()
        
        db, cursor =x.db()

        q = "SELECT * FROM users WHERE user_email = %s"
        cursor.execute(q,(user_email,))
        user = cursor.fetchone()
        if not user:
            error_message = "Invalid credentials 1"
            ___tip = render_template("___tip.html", status="error", message = error_message)
            return f"""<browser mix-after-begin ="#tooltip">{___tip}</browser>""", 400
        
        if not check_password_hash(user ["user_password"], user_password):
            error_message = "Invalid credentials 2"
            ___tip = render_template("___tip.html", status="error", message = error_message)
            return f"""<browser mix-after-begin ="#tooltip">{___tip}</browser>""", 400


        user.pop("user_password") # fjerner password fra session storage
        session["user"] = user

        return f""" 
        <browser mix-redirect="/profile"></browser>
        """

    except Exception as ex:
        ic(ex)

        #------------Email------------#
        if "company_exception user_email" in str(ex):
            error_message = f"user email invalid"
            ___tip = render_template("___tip.html", status="error", message = error_message)
            return f"""
            <browser mix-after-begin ="#tooltip">{___tip}</browser>
            """, 400

        #------------Password------------#
        if "company_exception user_password" in str(ex):
            error_message = f"user password {x.USER_PASSWORD_MIN} to {x.USER_PASSWORD_MAX} characters"
            ___tip = render_template("___tip.html", status="error", message = error_message)
            return f"""
            <browser mix-after-begin ="#tooltip">{___tip}</browser>
            """, 400

        # Worst case
        error_message = "System under maintenance"
        ___tip = render_template("___tip.html", status="error", message = error_message)
        return f"""<browser mix-after-begin ="#tooltip">{___tip}</browser>""", 400
    
    finally:
        if "cursor" in locals(): cursor.close() # locals referere til alt i "try" og "except", pr. funktion.
        if "db" in locals(): db.close()  

#-------------ROUTE PROFILE-------------#
@app.get("/profile")
@x.no_cache
def show_profile():
    try:
        user = session.get("user", "")
        if not user:
            return redirect ("/login")
        return render_template("page_profile.html", user=user, x=x)
    except Exception as ex:
        ic(ex)
        return "Hovsa"

#-------------ROUTE LOGOUT-------------#
@app.get("/logout")
def logout():
    try:
         session.clear()
         return redirect ("/login")
    except Exception as ex:
        ic(ex)
        return "Hovsa"

#-------------CREATE DESTINATION-------------#
@app.post("/api-destinations")
def api_create_destination():
    try:
        user=session.get("user")
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        
        destination_title=x.validate_destination_title()
        destination_date_from=x.validate_destination_date_from()
        destination_date_to=x.validate_destination_date_to()
        destination_description=x.validate_destination_description()
        destination_location=x.validate_destination_location()
        destination_country=x.validate_destination_country()

        destination_pk = uuid.uuid4().hex
        destination_created_at = int (time.time())
        user_fk=user["user_pk"]

        db, cursor = x.db()
        q = """
            INSERT INTO destinations VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute (q, (            destination_pk,
        destination_title,
        destination_date_from,
        destination_date_to,
        destination_description,
        destination_location,
        destination_country,
        destination_created_at,
        user_fk
        ))
        db.commit()

        return jsonify({
            "message": "Destination created",
            "destination_pk": destination_pk
        }), 201

    except Exception as ex:
        ic(ex)

        if "company_exception destination_title" in str(ex):
            return jsonify({"error": "destination title invalid"}), 400

        if "company_exception destination_date_from" in str(ex):
            return jsonify({"error": "destination date from required"}), 400

        if "company_exception destination_date_to" in str(ex):
            return jsonify({"error": "destination date to required"}), 400

        if "company_exception destination_location" in str(ex):
            return jsonify({"error": "destination location invalid"}), 400

        if "company_exception destination_country" in str(ex):
            return jsonify({"error": "destination country invalid"}), 400

        return jsonify({"error": "System under maintenance"}), 400

    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

#-------------SHOW CREATE DESTINATION PAGE-------------#
@app.get("/create-destination")
@x.no_cache
def show_create_destination():
    try:
        user=session.get("user", "")
        if not user:
            return redirect("/login")
        return render_template("page_create_destination.html", user=user, x=x)
    except Exception as ex:
        ic(ex)
        return "Hovsa"

#-------------GET ALL DESTINATIONS-------------#
@app.get("/api-destinations")
def api_get_destinations():
    try:
        db, cursor = x.db()
        q="""
            SELECT * FROM destinations
            ORDER BY destination_created_at DESC
        """

        cursor.execute(q)
        destinations = cursor.fetchall()

        return jsonify(destinations), 200
    
    except Exception as ex:
        ic(ex)
        return jsonify({"error": "System under maintenance"}), 500
    
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

#-------------SHOW ALL DESTINATIONS-------------#
@app.get("/destinations")
@x.no_cache
def show_destinations():
    try:
        user = session.get("user", "")
        return render_template("/page_destinations.html", user=user, x=x)
    except Exception as ex:
        ic(ex)
        return "Hovsa"

#-------------SHOW ONE DESTINATIONS-------------#
@app.get("/api-destinations/<destination_pk>")
def api_get_destination(destination_pk):
    try:
        db, cursor = x.db()
        q= """
            SELECT * FROM destinations WHERE destination_pk = %s
        """

        cursor.execute(q, (destination_pk,))
        destination = cursor.fetchone()

        return jsonify(destination), 200
    
    except Exception as ex:
        ic(ex)
        return jsonify({"Error": "System under maintenance"}), 500
    
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

#-------------SHOW ONE DESTINATION ID-------------#
@app.get("/destination/<destination_pk>")
@x.no_cache
def show_destination(destination_pk):
    try:
        user = session.get("user", "")
        return render_template("page_single_destination.html", user=user, x=x)
    
    except Exception as ex:
        ic(ex)
        return "Hovsa"

#-------------UPDATE DESTINATION-------------#
@app.patch("/api-destinations/<destination_pk>")
def api_destination(destination_pk):
    try:
        user = session.get("user")
        if not user:
            return jsonify({"Error": "Unauthorized"}), 401
        
        destination_title = x.validate_destination_title()
        destination_date_from = x.validate_destination_date_from()
        destination_date_to = x.validate_destination_date_to()
        destination_description = x.validate_destination_description()
        destination_location = x.validate_destination_location()
        destination_country = x.validate_destination_country()

        db, cursor = x.db()
        q = """
            UPDATE destinations 
            SET destination_title = %s,        
                destination_date_from = %s,
                destination_date_to = %s,
                destination_description = %s,
                destination_location = %s,
                destination_country = %s
            WHERE destination_pk = %s
        """

        cursor.execute (q, (
            destination_title,
            destination_date_from,
            destination_date_to,
            destination_description,
            destination_location,
            destination_country,
            destination_pk
        ))
        db.commit()

        return jsonify({"message": "Destination updated"}), 200
    
    except Exception as ex:
        ic(ex)

        if "company_exception destination_title" in str(ex):
            return jsonify({"error": "destination title invalid"}), 400

        if "company_exception destination_date_from" in str(ex):
            return jsonify({"error": "destination date from required"}), 400

        if "company_exception destination_date_to" in str(ex):
            return jsonify({"error": "destination date to required"}), 400

        if "company_exception destination_location" in str(ex):
            return jsonify({"error": "destination location invalid"}), 400

        if "company_exception destination_country" in str(ex):
            return jsonify({"error": "destination country invalid"}), 400

        return jsonify({"error": "System under maintenance"}), 400

    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

#-------------DELETE DESTINATION-------------#
@app.delete("/api-destinations/<destination_pk>")
def api_delete_destination(destination_pk):
    try:
        user = session.get("user")
        if not user:
            return jsonify({"error": "Unauthorized"}), 401

        db, cursor = x.db()
        q = """
            DELETE FROM destinations
            WHERE destination_pk = %s
        """
        cursor.execute(q, (destination_pk,))
        db.commit()

        return jsonify({"message": "Destination deleted"}), 200

    except Exception as ex:
        ic(ex)
        return jsonify({"error": "System under maintenance"}), 400

    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()