import json
import boto3

table = boto3.resource('dynamodb').Table('my_table')

def lambda_handler(event, context):
    print("*******************EVENT*****************************")
    print(event)
    response = table.update_item(
        ExpressionAttributeNames={
            '#ACT': 'active',
            '#BD': 'brew_description',
            '#BN': 'brew_name',
            '#CA': 'createdAt',
            '#CL': 'current_level',
            '#FD': 'finish_date',
            '#ID': 'id',
            '#KD': 'kegging_date',
            '#MD': 'mashing_date',
            '#UA': 'updatedAt',
        },
        ExpressionAttributeValues={
            ':act': event["item"]["active"],
            ':bd': event["item"]["brew_description"],
            ':bn': event["item"]["brew_name"],
            ':ca': event["item"]["createdAt"],
            ':cl': event["item"]["current_level"],
            ':fd': event["item"]["finish_date"],
            ':id': event["item"]["id"],
            ':kd': event["item"]["kegging_date"],
            ':md': event["item"]["mashing_date"],
            ':ua': event["item"]["updatedAt"],
        },
        Key={'slot_id': int(event["key_sid"])},
        ReturnValues='ALL_NEW',
        TableName='current_kegs',
        UpdateExpression='SET #ACT = :act, #BD = :bd, #BN = :bn, #CA = :ca, #CL = :cl, #FD = :fd, #ID = :id, #KD = :kd, #MD = :md, #UA = :ua',
    )
    return {
        'statusCode': 200,
    }