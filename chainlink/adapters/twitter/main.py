"""Module for Twitter API calls"""

import json
from datetime import datetime as dt
from datetime import timezone as tz
import pendulum

from fastapi import FastAPI, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader, APIKeyQuery
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from starlette.status import HTTP_403_FORBIDDEN
from tweepy import Client

# CREDENTIALS = json.load(open("chainlink/adapters/twitter/TWITTER_CREDS.json"))
CREDENTIALS = json.load(open("TWITTER_CREDS.json"))
client = Client(CREDENTIALS["bearer_token"])

API_KEYS = [
    "chainlink",
]
API_KEY_NAME = "access_token"

api_key_query = APIKeyQuery(name=API_KEY_NAME, auto_error=False)
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

app = FastAPI(docs_url="/")


class Request(BaseModel):
    id: str
    data: dict
    meta: dict = None
    responseURL: str = None


async def get_api_key(
    api_key_query: str = Security(api_key_query),
    api_key_header: str = Security(api_key_header),
):

    if api_key_query in API_KEYS:
        return api_key_query
    elif api_key_header in API_KEYS:
        return api_key_header
    else:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Could not validate credentials")

@app.exception_handler(Exception)
async def unicorn_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        jobRunID=request.id,
        data=request.data,
        statusCode=413
    )

# TODO: How would this work wihtout specifying a username?
@app.post("/router/")
def router(request: Request) -> dict:
    """Returns the timestamp of the latest tweet for the given user.
    Args:
        request (Request): The request object.
    Returns:
        dict: Dict with timestamp of the latest tweet.
    """
    if not request.data['userid']:
        if 'username' in request.data:
            username = request.data["username"]
            userid = get_userid(username)
            request.data['userid'] = userid
        else:
            raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Must either specify userid or username.")
    if not 'method' in request.data:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Must specify method.")

    method = eval(request.data['method'])
    payload = method(request)
    request.data['payload'] = payload
    print(request)

    return {
        "jobRunID": request.id,
        "data": request.data,
        "statusCode": 200,
    }

@app.post("/latest_tweet_ts/")
def latest_tweet_ts(request: Request) -> int:
    userid = request.data['userid']
    data = client.get_users_tweets(userid, tweet_fields=["created_at"]).data
    tweet = data[0]
    ts = int(tweet.created_at.timestamp())
    return ts


@app.get("/userid/{username}")
def get_userid(username: str) -> int:
    return client.get_user(username=username).data.id


@app.get("/since_last_tweet/likes")
def likes_since_ts(request: Request) -> int:
    # sourcery skip: inline-immediately-returned-variable
    """Returns the number of likes since a given unix timetamp for the given username.

    Args:
        username (str): Twitter username
        unix_ts (int): Unix timestamp

    Returns:
        int: Number of likes since the given unix timestamp
    """
    userid = request.data['userid']
    unix_ts = int(request.data['unix_ts'])
    data = client.get_users_tweets(
        userid,
        tweet_fields=["created_at", "public_metrics"],
        start_time=dt.fromtimestamp(unix_ts, tz=tz.utc).isoformat(),
    ).data
    cum_like_count = sum(tweet.public_metrics["like_count"] for tweet in data)
    return cum_like_count


@app.get("/tweet_count/yesterday")
def tweet_count_yesterday(username: str) -> int:
    """Returns the number of tweets posted yesterday by the specified user.

    Args:
        username (str): twitter username

    Returns:
        int: count of tweets
    """
    yesterday = pendulum.yesterday(tz="UTC")

    start_time = yesterday.start_of("day")
    end_time = yesterday.end_of("day")

    user = client.get_user(username=username).data
    data = client.get_users_tweets(user.id, tweet_fields=["created_at"], start_time=start_time, end_time=end_time).data

    if not data:
        return 0

    return len(data)


@app.get("/tweet_count/last_week")
def tweet_count_last_week(username: str) -> int:
    """Returns the number of tweets posted in the last week by the specified user.

    Args:
        username (str): twitter username

    Returns:
        int: count of tweets
    """
    today = pendulum.today(tz="UTC")
    start_of_last_week = today.start_of("week").subtract(days=7)
    end_of_last_week = start_of_last_week.end_of("week")

    user = client.get_user(username=username).data
    data = client.get_users_tweets(
        user.id, tweet_fields=["created_at"], start_time=start_of_last_week, end_time=end_of_last_week
    ).data

    if not data:
        return 0

    return len(data)
