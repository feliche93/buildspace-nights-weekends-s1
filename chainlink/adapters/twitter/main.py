from fastapi import FastAPI, Security, HTTPException, Depends
from fastapi.security.api_key import APIKeyQuery, APIKeyHeader, APIKey
from starlette.status import HTTP_403_FORBIDDEN
import json
from tweepy import Client
from datetime import datetime as dt, timedelta as td, timezone as tz
from functools import reduce

# CREDENTIALS = json.load(open("chainlink/adapters/twitter/TWITTER_CREDS.json"))
CREDENTIALS = json.load(open("TWITTER_CREDS.json"))
client = Client(CREDENTIALS["bearer_token"])

API_KEYS = [
    "chainlink",
]
API_KEY_NAME = "access_token"

api_key_query = APIKeyQuery(name=API_KEY_NAME, auto_error=False)
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

app = FastAPI(docs_url='/')

async def get_api_key(
    api_key_query: str = Security(api_key_query),
    api_key_header: str = Security(api_key_header),
):

    if api_key_query in API_KEYS:
        return api_key_query
    elif api_key_header in API_KEYS:
        return api_key_header
    else:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="Could not validate credentials"
        )
        

@app.get("/latest_tweet_ts/")
def latest_tweet_ts(username: str, api_key: APIKey = Depends(get_api_key)):
    user = client.get_user(username=username).data
    data = client.get_users_tweets(user.id, tweet_fields=["created_at"]).data
    tweet = data[0]
    ts = int(tweet.created_at.timestamp())
    return ts


@app.get("/since_last_tweet/likes")
def likes_since_last_tweet(username: str, ts: int, api_key: APIKey = Depends(get_api_key)):
    user = client.get_user(username=username).data
    data = client.get_users_tweets(
        user.id,
        tweet_fields=["created_at", "public_metrics"],
        start_time=dt.fromtimestamp(ts, tz=tz.utc).isoformat()
        ).data
    cum_like_count = sum(tweet.public_metrics["like_count"] for tweet in data)
    return cum_like_count