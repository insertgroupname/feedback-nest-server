# API Docs

## Note

- The **`*multiple`** mark is multiple object that have similar object pattern but dynamic key.

  - for example

  ```json
  "marker": {
    *multiple [string]: {
    "hes_count": number,
    "words": <number | string>[][],
  }
  ```

  it may appear as below

  ```json
  "marker": {
    "50.75-101.5": {
      "hes_count": 1,
      "words": [
        [
          "%HESITATION",
          88.04,
          88.23
        ]
      ]
    },
    "101.5-152.25": {
      "hes_count": 1,
      "words": [
        [
          "%HESITATION",
          138.5,
          138.66
        ]
      ]
    }
  }
  ```

## baseroute `/api`

### Auth

> POST `/api/v2/login`
> POST `/api/v2/register`

### Record

- Get all record of the user

  - return record with out post-processing and transcript as **Array**

    > GET `/v2/record/landing`

    return result

    ```json
    {
      "_id": string,
      "status": string,
      "stopwords": string[],
      "tags": string[],
      "description": string,
      "videoUUID": string,
      "videoName": string,
      "lastUpdate": Date,
      "createDate": Date,
    }[]
    ```

- Get all record related specific tag

  - return all record related to request tag with post-processing and transcript as **Array**

    > GET `/v2/record/tag/?tag=<tag_name>`

    return result

    ```json
    {
      "_id": string,
      "status": string,
      "stopwords": string[],
      "tags": string[],
      "description": string,
      "videoUUID": string,
      "videoName": string,
      "lastUpdate": Date,
      "createDate": Date,
      "report": {
        "transcript": {
          "transcript": string,
          "confidence": number,
          "timestamps": <number | string>[][],
          "word_confidence" : <number | string>[][]
        }[],
        "postProcessing": {
          "hestiation_": {
            "marker": {
              *multiple [string]: {
                "hes_count": number,
                "words": <number | string>[][],
              }
            },
            "total_count": number
          },
          "hestiation_duration": number,
          "word_frequency": {
            "word": <number | string>[][],
            "bigram": <number | string[]>[][]
          },
          "wpm":  {
            *multiple [string]: {
              "wpm": number,
              "words": <number | string>[][]
            }
          },
          "silence": {
          "total_silence": number,
          "silence_list": {
              "silence_period": number,
              "silence_start": number,
              "silence_end": number
            }[]
          },
          "start_process_time": number,
          "end_process_time": number,
          "video_len": number,
          "total_words": number,
          "avg_wpm": number,
          "vocab": {
            "total_vocab": number,
            "vocab": {
              *multiple [string]: {
                "word": string,
                "count": number,
                "pos": string,
                "%": number
              }
            },
            "repeat_list": {
              *multiple [string]: number
            },
            "keyword": string[],
            "custom_stopwords": <number | string>[][]
          }
        }
      }
    }[]
    ```

- Get report of the record

  - return the full record of requested `videoUUID`

    > GET `/v2/record/report/:videoUUID`

    return result

    ```json
    {
      "_id": string,
      "status": string,
      "stopwords": string[],
      "tags": string[],
      "description": string,
      "videoUUID": string,
      "videoName": string,
      "lastUpdate": Date,
      "createDate": Date,
      "report": {
        "transcript": {
          "transcript": string,
          "confidence": number,
          "timestamps": <number | string>[][],
          "word_confidence" : <number | string>[][]
        }[],
        "postProcessing": {
          "hestiation_": {
            "marker": {
              *multiple [string]: {
                "hes_count": number,
                "words": <number | string>[][],
              }
            },
            "total_count": number
          },
          "hestiation_duration": number,
          "word_frequency": {
            "word": <number | string>[][],
            "bigram": <number | string[]>[][]
          },
          "wpm":  {
            *multiple [string]: {
              "wpm": number,
              "words": <number | string>[][]
            }
          },
          "silence": {
          "total_silence": number,
          "silence_list": {
              "silence_period": number,
              "silence_start": number,
              "silence_end": number
            }[]
          },
          "start_process_time": number,
          "end_process_time": number,
          "video_len": number,
          "total_words": number,
          "avg_wpm": number,
          "vocab": {
            "total_vocab": number,
            "vocab": {
              *multiple [string]: {
                "word": string,
                "count": number,
                "pos": string,
                "%": number
              }
            },
            "repeat_list": {
              *multiple [string]: number
            },
            "keyword": string[],
            "custom_stopwords": <number | string>[][]
          }
        }
      }
    }
    ```

- Get analytic of report of all records related to specific tag name

  - return analytic result

    > GET `/v2/record/report/analytic/?tag=<tag_name>`

    return result

    ```json
    {
      "avgResult": {
          "avgWPM": number,
          "avgDisfluencyCount": number,
          "avgDisfluencyPerTotalWord": number,
          "avgDisfluencyPerVideoLength": number,
          "avgDisfluencyPerSilence": number,
          "avgSilencePerVideoLength": number,
          "totalVideo": number
      },
      "scoringResult": {
          "wpmScore": number,
          "hesitationDurationScore": number,
          "silenceDurationScore": number
      },
      "allVideoAnalytic": {
        "wpm": {
          "videoUUID": string,
          "videoName": string,
          "avgWPM": number
        }[],
        "disfluencyPerTotalWord": {
          "videoUUID": string,
          "videoName": string,
          "disfluencyCount": number,
          "totalWord": number,
          "disfluencyPerTotalWord": number
        }[],
        "disfluencyPerVideoLength": {
          "videoUUID": string,
          "videoName": string,
          "disfluencyDuration": number,
          "videoLength": number,
          "disfluencyPerVideoLength": number
        }[],
        "disfluencyPerSilence": {
          "videoUUID": string,
          "videoName": string,
          "silenceDuration": number,
          "disfluencyDuration": number,
          "disfluencyPersilenceDuration": number
        }[],
        "silencePerVideoLength": {
          "videoUUID": string,
          "videoName": string,
          "silenceDuration": number,
          "videoLength": number,
          "silencePerVideoLength": number
        },

      }
    }
    ```

- Get streaming of record

  - return streaming file type `.ogg`

    > GET `/v2/record/streaming/:videoUUID`

- Post upload video or audio

  - Upload the video or audio to the server

    > POST `/v2/upload`

    - The request body should be

    ```json
    {
      "file": file,
      "videoName"?: string,
      "description"?: string
    }
    ```

- Update the record detail

  - Update available varieble are `description`, `videoName`, and `tags`

    > PATCH `/v2/record/report/:videoUUID`

    - The request body should be

    ```json
    {
      "videoName"?: string,
      "tags"?: string[],
      "description"?: string
    }
    ```

- Delete the record of specific `videoUUID`

  - delete the record

    > DELETE `/v2/record/report/:videoUUID`

### User

- Get the user data

  - return the data of the logon user

    > GET `/v2/user/data`

    return result

    ```json
    {
      "stopwords": string[],
      "tags": string[],
      "username": string,
      "email": string,
      "type": string
    }

    ```

- Update the user data

  - update the data of user

    > PATCH `/v2/user/data/edit`

    - The request body should be

    ```json
    {
      "tags"?: string[],
      "stopwords"?: string[],
    }
    ```

### Admin

- Get all user post-processing

  - return post-processing of all user as **Array**

    > GET `/v2/admin/userstat`

    return result

    ```json
      {
        "_id": string,
        "report": {
          "postProcessing": {
            "hestiation_": {
              "marker": {
                *multiple [string]: {
                  "hes_count": number,
                  "words": <number | string>[][],
                }
              },
              "total_count": number
            },
            "hestiation_duration": number,
            "word_frequency": {
              "word": <number | string>[][],
              "bigram": <number | string[]>[][]
            },
            "wpm":  {
              *multiple [string]: {
                "wpm": number,
                "words": <number | string>[][]
              }
            },
            "silence": {
            "total_silence": number,
            "silence_list": {
                "silence_period": number,
                "silence_start": number,
                "silence_end": number
              }[]
            },
            "start_process_time": number,
            "end_process_time": number,
            "video_len": number,
            "total_words": number,
            "avg_wpm": number,
            "vocab": {
              "total_vocab": number,
              "vocab": {
                *multiple [string]: {
                  "word": string,
                  "count": number,
                  "pos": string,
                  "%": number
                }
              },
              "repeat_list": {
                *multiple [string]: number
              },
              "keyword": string[],
              "custom_stopwords": <number | string>[][]
            }
          }
        }
      }[]
    ```

- Get all of average stat

  - return all of the average stat

    > GET `/v2/admin/allAvg`

    return result

    ```json
    {
      "_id": string,
      "totalVideo": number,
      "avgSilencePerVideoLength": number,
      "avgDisfluencyPerSilence": number,
      "avgDisfluencyPerVideoLength": number,
      "avgDisfluencyPerTotalWord": number,
      "avgDisfluencyCount": number,
      "avgWPM": number,
      "createDate": Date,
    },
    ```

- Get all admin preset baseline

  - return all previous admin preset baseline

    > GET `/v2/admin/allBaseline`

    return result

    ```json
    {
      "_id": string,
      "WPMrange": number[][],
      "acceptableDisfluencyPerMinut": number,
      "createDate": Date,
    },
    ```

- Set baseline preset

  - make a new baseline preset

    > POST `/v2/admin/setBaseline`

    The request body should be

    ```json
    {
      "WPMrange": number[][],
      "acceptableDisfluencyPerMinut": number,
    }
    ```

- Make a new average stat

  - make a new global average stat across the records in the server

    - It may not do anything if there is no new record.

    > PUT `/v2/admin/newAvgStat`
