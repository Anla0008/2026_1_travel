from flask import request, make_response
import mysql.connector
import re # Regular expression module for validating input also called "regex"
from functools import wraps

#-------------CONNECTION TO DATABASE-------------#
def db():
    try:
        db = mysql.connector.connect(
            host = "mariadb",
            user = "root",  
            password = "password",
            database = "2026_1_travel" # Navnet på den database vi har i vores docker (kan skiftes til docker-compose.ylm)
        )
        cursor = db.cursor(dictionary=True)
        return db, cursor
    except Exception as e:
        print(e, flush=True)
        raise Exception("Database under maintenance", 500)

#-------------NO CACHE COOKIES-------------#
def no_cache(view):
    @wraps(view)
    def no_cache_view(*args, **kwargs):

        response = make_response(view(*args, **kwargs))
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"

        return response
    return no_cache_view

#-------------VALIDATION FOR FIRST NAME-------------#
USER_FIRST_NAME_MIN = 2
USER_FIRST_NAME_MAX = 20
REGEX_USER_FIRST_NAME = f"^.{{{USER_FIRST_NAME_MIN},{USER_FIRST_NAME_MAX}}}$" # Regex med en f-string.

def validate_user_first_name():
    user_first_name = request.form.get("user_first_name", "").strip()

    if not re.match(REGEX_USER_FIRST_NAME, user_first_name):
        raise Exception ("company_exception user_first_name")
    return user_first_name

#-------------VALIDATION FOR LAST NAME-------------#
USER_LAST_NAME_MIN = 2
USER_LAST_NAME_MAX = 20
REGEX_USER_LAST_NAME = f"^.{{{USER_LAST_NAME_MIN},{USER_LAST_NAME_MAX}}}$" # Regex med en f-string.

def validate_user_last_name():
    user_last_name = request.form.get("user_last_name", "").strip()

    if not re.match(REGEX_USER_LAST_NAME, user_last_name):
        raise Exception ("company_exception user_last_name")
    return user_last_name


#------------VALIDATION FOR EMAIL------------#
REGEX_USER_EMAIL = "^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$"
def validate_user_email():
    user_email = request.form.get("user_email", "").strip()
    if not re.match(REGEX_USER_EMAIL, user_email):
        raise Exception("company_exception user_email")
    return user_email


#-------------VALIDATION FOR PASWORD-------------#
USER_PASSWORD_MIN = 8
USER_PASSWORD_MAX = 50
REGEX_USER_PASSWORD = f"^.{{{USER_PASSWORD_MIN},{USER_PASSWORD_MAX}}}$" # Regex med en f-string.

def validate_user_password():
    user_password = request.form.get("user_password", "").strip()

    if not re.match(REGEX_USER_PASSWORD, user_password):
        raise Exception ("company_exception user_password")
    return user_password

#-------------VALIDATION FOR DISTINATION TITLE-------------#
DESTINATION_TITLE_MIN = 2 
DESTINATION_TITLE_Max = 100
REGEX_DESTINATION_TITLE = f"^.{{{DESTINATION_TITLE_MIN}, {DESTINATION_TITLE_Max}}}$"

def validate_destination_title():
    destination_title = request.form.get ("destination_title", "").strip()

    if not re.match(REGEX_DESTINATION_TITLE, destination_title):
        raise Exception ("company_exception destination_title")
    return destination_title

#-------------VALIDATION FOR DISTINATION DATE FROM-------------#
def validate_destination_date_from():
    destination_date_from = request.form.get("destination_date_from", "").strip()

    if not destination_date_from:
        raise Exception ("company_exception destination_date_from")
    return destination_date_from

#-------------VALIDATION FOR DISTINATION DATE TO-------------#
def validate_destination_date_to():
    destination_date_to = request.form.get("destination_date_to", "").strip()

    if not destination_date_to:
        raise Exception ("company_exception destination_date_to")
    return destination_date_to

#-------------VALIDATION FOR DISTINATION DESCRIPTION-------------#
def validate_destination_description():
    destination_description = request.form.get("destination_description", "").strip()
    return destination_description

#-------------VALIDATION FOR DISTINATION LOCATION-------------#
DESTINATION_LOCATION_MIN = 2
DESTINATION_LOCATION_MAX = 100
REGEX_DESTINATION_LOCATION = f"^.{{{DESTINATION_LOCATION_MIN}, {DESTINATION_LOCATION_MAX}}}$"

def validate_destination_location():
    destination_location = request.form.get("destination_location", "").strip()

    if not re.match(REGEX_DESTINATION_LOCATION, destination_location):
        raise Exception ("company_exception destination_location")
    return destination_location

#-------------VALIDATION FOR DISTINATION COUNTRY-------------#
DESTINATION_COUNTRY_MIN = 2
DESTINATION_COUNTRY_MAX = 100
REGEX_DESTINATION_COUNTRY = f"^.{{{DESTINATION_COUNTRY_MIN}, {DESTINATION_COUNTRY_MAX}}}$"

def validate_destination_country():
    destination_country=request.form.get("destination_country", "").strip()

    if not re.match(REGEX_DESTINATION_COUNTRY, destination_country):
        raise Exception("company_exception destination_country")
    return destination_country
