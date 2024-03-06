from typing import Any, Dict

from snowflake.snowpark.session import Session
from snowflake.snowpark.exceptions import SnowparkSQLException

import re
import os
import modal

from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from modal import Image, Stub, web_endpoint

web_app = FastAPI()
auth_scheme = HTTPBearer()

stub = Stub("snowexecute")

image = Image.debian_slim(python_version="3.11").pip_install(
    "snowflake_snowpark_python",
    "snowflake-snowpark-python[pandas]",
)

stub.sb_image = image

class SnowflakeConnection:
    def __init__(self):
        self.connection_parameters = {
            "account": os.environ["ACCOUNT"],
            "user": os.environ["USER_NAME"],
            "password": os.environ["PASSWORD"],
            "warehouse": os.environ["WAREHOUSE"],
            "database": os.environ["DATABASE"],
            "schema": os.environ["SCHEMA"],
            "role": os.environ["ROLE"],
        }
        self.session = None

    def get_session(self):
        if self.session is None:
            self.session = Session.builder.configs(self.connection_parameters).create()
            self.session.sql_simplifier_enabled = True
        return self.session

@stub.function(image=image, secrets=[modal.Secret.from_name("snowrun")], cpu=1)
@web_endpoint(method="POST")
def execute_sql(query: Dict, token: HTTPAuthorizationCredentials = Depends(auth_scheme),) -> Optional[Any]:
    if token.credentials != os.environ["AUTH_TOKEN"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    query_text = query["query"]
    conn = SnowflakeConnection().get_session()
    if re.match(r"^\s*(drop|alter|truncate|delete|insert|update)\s", query_text, re.I):
        return None
    try:
        df = conn.sql(query_text)
        # Convert to Pandas DataFrame to easily extract column names
        pandas_df = df.to_pandas()
        # Extract column names
        columns = list(pandas_df.columns)
        # Convert rows to dictionaries
        data = pandas_df.to_dict('records')
        return {"columns": columns, "data": data}
    except SnowparkSQLException as e:
        return {"error": str(e)}

if __name__ == "__main__":
    stub.deploy("snowexecute")

    