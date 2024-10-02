from fastapi import FastAPI, Request,Form,Response,File,UploadFile,HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse,RedirectResponse
from pymongo import MongoClient
import string
import random
import hashlib
import os


# Алфавит для создания случайных названий картинок
alphabet = string.digits + string.ascii_lowercase


templates=Jinja2Templates(directory='templates')
app = FastAPI()

client = MongoClient("db", 27017)
# client.drop_database('test_database')
# client.drop_database('password_database')
# client.drop_database('session_database')
db = client.test_database
dbPassword = client.password_database
dbSession = client.session_database
collection = client.test_collection
collectionPassword = client.password_collection
posts = db.posts
postsPassword = dbPassword.posts
postsSession = dbSession.posts

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get('/')
async def welcome(request:Request) :
    cookies = request.cookies
    session_value = cookies.get("session")
    res = postsSession.find_one({"Session": session_value})
    if(res==None):
        return RedirectResponse(url="/auth")
    return templates.TemplateResponse(name='index.html',context={'request':request})

@app.get('/auth')
async def welcome(request:Request) :
    cookies = request.cookies
    session_value = cookies.get("session")
    res = postsSession.find_one({"Session": session_value})
    if(res!=None):
        return RedirectResponse(url="/")
    return templates.TemplateResponse(name='auth.html',context={'request':request})

@app.get('/register')
async def welcome(request:Request) :
    cookies = request.cookies
    session_value = cookies.get("session")
    res = postsSession.find_one({"Session": session_value})
    if(res!=None):
        return RedirectResponse(url="/")
    return templates.TemplateResponse(name='register.html',context={'request':request})

async def new_delete_file(name: str):
    path = "static/images/"
    path+=name
    try:
        if(path!="static/images/"):
            os.remove(path)
    except FileNotFoundError:
        pass
    return {"message": "Файл успешно удалён"}


@app.put('/data')
async def upload(request: Request):
    cookies = request.cookies
    session_value = cookies.get("session")
    res = postsSession.find_one({"Session": session_value})
    if(res==None):
        raise HTTPException(status_code=403, detail="Аккаунт не найден")

    form_data = await request.form()
    n=posts.count_documents({})
    newN = posts.find({'user_id': res["id"] })
    count = int(len(list(newN)))+1
    id=form_data.get("id")
    photo_device = form_data.get("photo_device")
    photo_serial_number_device = form_data.get("photo_serial_number_device")
    photo_ITAM_device = form_data.get("photo_ITAM_device")

    check = posts.find_one({"user_id":res["id"],"id": int(id)})
    if(check==None):
        raise HTTPException(status_code=404, detail="Запись не найдена")
    filter = {'user_id':res["id"],'id': int(id)}

    posts.update_many(filter, {'$set': {'type_device': form_data.get("type_device")}})
    posts.update_many(filter, {'$set': {'model_device': form_data.get("model_device")}})
    posts.update_many(filter, {'$set': {'serial_number': form_data.get("serial_number")}})
    posts.update_many(filter, {'$set': {'ITAM_device': form_data.get("ITAM_device")}})
    delete = posts.find_one({'user_id':res["id"],'id': int(id)})
    if(photo_device!="undefined"):
        await new_delete_file(delete['photo_device'])
        name_photo_device = await newUpload(photo_device)
        posts.update_many(filter, {'$set': {'photo_device': name_photo_device}})
    if(photo_serial_number_device!="undefined"):
        await new_delete_file(delete['photo_serial_number_device'])
        name_photo_serial_number_device = await newUpload(photo_serial_number_device)
        posts.update_many(filter, {'$set': {'photo_serial_number_device': name_photo_serial_number_device}})
    if(photo_ITAM_device!="undefined"):
        await new_delete_file(delete['photo_ITAM_device'])
        name_photo_ITAM_device = await newUpload(photo_ITAM_device)
        posts.update_many(filter, {'$set': {'photo_ITAM_device': name_photo_ITAM_device}})

    # delete1 = form_data.get("delete1")
    # await new_delete_file(delete1)
    # delete2 = form_data.get("delete2")
    # await new_delete_file(delete2)
    # delete3 = form_data.get("delete3")
    # await new_delete_file(delete3)

    return {"message": "Запись успешно изменена"}

@app.get("/data")
async def read_data(request: Request):
    cookies = request.cookies
    session_value = cookies.get("session")
    res = postsSession.find_one({"Session": session_value})
    if(res==None):
        raise HTTPException(status_code=403, detail="Аккаунт не найден")
    dataSend = posts.find({'user_id': res["id"]})
    posts_list = []
    for post in dataSend:
        post_dict = dict(post)
        del post_dict['_id']
        posts_list.append(post_dict)
    return posts_list

@app.delete('/data/{numDelete}')
async def delete(request: Request,numDelete: str):
    cookies = request.cookies
    session_value = cookies.get("session")
    res = postsSession.find_one({"Session": session_value})
    if(res==None):
        raise HTTPException(status_code=403, detail="Аккаунт не найден")
    count = posts.count_documents({})
    file = posts.find_one({"user_id":res["id"],"id": int(numDelete)})
    if(file==None):
        raise HTTPException(status_code=404, detail="Запись не найдена")
    path = "static/images/"
    fil1 = path+file["photo_device"]
    fil2 = path+file["photo_serial_number_device"]
    fil3 = path+file["photo_ITAM_device"]
    try:
        if(fil1!="static/images/"):
            os.remove(fil1)
        if(fil2!="static/images/"):
            os.remove(fil2)
        if(fil3!="static/images/"):
            os.remove(fil3)
    except FileNotFoundError:
        pass
    filterDelete = {'user_id':res["id"],'id': int(numDelete)}
    posts.delete_one(filterDelete)
    for i in range(int(numDelete)+1,count+1):
        filter = {'user_id':res["id"],'id': i}
        result = posts.update_one(filter, {'$set': {'id': i-1}})
    return {"message": "Запись успешно удалена"}

async def newUpload(file: UploadFile):
    newName = "".join([alphabet[random.randint(0, len(alphabet) -1)] for _ in range(0, 60)])
    exp=f".{file.filename.rsplit('.', 1)[1]}"
    newName +=exp
    file.filename = newName
    with open(f"static/images/{file.filename}", "wb") as f:
            f.write(await file.read())
    return newName

@app.post('/form')
async def sendForm(request: Request):
    cookies = request.cookies
    session_value = cookies.get("session")
    res = postsSession.find_one({"Session": session_value})
    if(res==None):
        raise HTTPException(status_code=403, detail="Аккаунт не найден")
    form_data = await request.form()
    n=posts.count_documents({})
    newN = posts.find({'user_id': res["id"] })
    count = int(len(list(newN)))+1
    photo_device = form_data.get("photo_device")
    photo_serial_number_device = form_data.get("photo_serial_number_device")
    photo_ITAM_device = form_data.get("photo_ITAM_device")
    name_photo_device = await newUpload(photo_device)
    name_photo_serial_number_device = await newUpload(photo_serial_number_device)
    name_photo_ITAM_device = await newUpload(photo_ITAM_device)
    if( posts.count_documents({}) == n):
        post = {
            "user_id": res["id"],
            "id": count,
            "type_device": form_data.get("type_device"),
            "model_device": form_data.get("model_device"),
            "serial_number": form_data.get("serial_number"),
            "ITAM_device": form_data.get("ITAM_device"),
            "photo_device": name_photo_device,
            "photo_serial_number_device": name_photo_serial_number_device,
            "photo_ITAM_device": name_photo_ITAM_device,
        }
        res = posts.insert_one(post).inserted_id
    return {"message": "Запись успешно добавлена"}

@app.delete("/file/{name}")
async def delete_file(request: Request,name: str):
    cookies = request.cookies
    session_value = cookies.get("session")
    res = postsSession.find_one({"Session": session_value})
    if(res==None):
        raise HTTPException(status_code=403, detail="Аккаунт не найден")
    path = "static/images/"
    path+=name
    try:
        if(path!="static/images/"):
            os.remove(path)
    except FileNotFoundError:
        pass
    return {"message": "Файл успешно удалён"}

@app.post("/signIn")
async def signIn(request: Request):
    data = await request.json()
    email = data["email"]
    password = data["password"]
    res = postsPassword.find_one({'email': email})
    if(res==None):
        raise HTTPException(status_code=403, detail="Аккаунт не найден")
    salt = res['salt']
    hash = res['password']
    newHash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000).hex()
    if(hash != newHash):
        raise HTTPException(status_code=422, detail="Не правильный пароль")
    hashSession = hashlib.pbkdf2_hmac('sha256', email.encode('utf-8'),os.urandom(16).hex().encode('utf-8'), 100000).hex()
    content = {"message": "true"}
    response = JSONResponse(content=content)
    response.set_cookie(key="session", value=hashSession)

    try:
        filterDelete = {'id':res["id"]}
        postsSession.delete_one(filterDelete)
    except ValueError:
        pass

    n=postsSession.count_documents({})
    if( postsSession.count_documents({}) == n):
        post = {
            "id": res["id"],
            "Session": hashSession
        }
        res = postsSession.insert_one(post).inserted_id

    return response

@app.post("/signUp")
async def signUp(request: Request):
    data = await request.json()
    email = data["email"]
    password = data["password"]
    res = postsPassword.find_one({'email': email})
    if(res!=None):
        raise HTTPException(status_code=403, detail="Аккаунт не найден")
    if(len(password)<8):
        raise HTTPException(status_code=422, detail="Пароль слишком короткий")
    n=postsPassword.count_documents({})
    salt = os.urandom(16)
    hashPassword = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.hex().encode('utf-8'), 100000)
    newId = postsPassword.count_documents({})+1
    if( postsPassword.count_documents({}) == n):
        post = {
            "id": newId,
            "email": email,
            "password":hashPassword.hex(),
            "salt":salt.hex().encode('utf-8')
        }
        postsPassword.insert_one(post).inserted_id
    return {"message": "Регистрация успешна"}

@app.post("/exit")
async def auth(request:Request):
    cookies = request.cookies
    session_value = cookies.get("session")
    res = postsSession.find_one({"Session": session_value})
    if(res==None):
        content = {"message": "true"}
        response = JSONResponse(content=content)
        response.delete_cookie(key="session")
        return response

    try:
        filterDelete = {'id':res["id"]}
        postsSession.delete_one(filterDelete)
    except ValueError:
        pass
    content = {"message": "true"}
    response = JSONResponse(content=content)
    response.delete_cookie(key="session")
    return response
