const express = require('express');
const { translate } = require('free-translate');
const cors = require('cors');
const { MongoClient, ObjectId  } = require('mongodb');
const upload = require('./utils/SingetImage');
const uploadMulter = require('./utils/MultipleImage');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'; // Use environment variable or default to localhost
const dbName = process.env.DB_NAME || 'lahlou'; // Use environment variable or default to 'lahlou'
         

const client = new MongoClient(uri);

async function connectAndInsert(data) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('your_collection_name');

        // Insert dataArray into the collection
        const result = await collection.insertOne({data});
        console.log(`${result.insertedCount} document inserted`);
    } catch (error) {
        console.error('Error occurred:', error);
        throw error; // This will propagate the error up the call stack
    } finally {
        // Close the connection
        await client.close();
    }
}

async function connectAndUpdateId(data) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('number');

        // Insert dataArray into the collection
        const result = await collection.insertOne({data});
        console.log(`${result.insertedCount} document inserted`);
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        // Close the connection
        await client.close();
    }
}

// dataForm
async function connectAndInsertDataForm(data) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('DataForm');

        // Insert dataArray into the collection
        const result = await collection.insertOne({data});
        console.log(`${result.insertedCount} document inserted`);
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        // Close the connection
        await client.close();
    }
}

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('public/uploads'));
require('dotenv').config();

// const uri2 = "mongodb+srv://lahlou:Oh0nQQtXT7ymDB0O@cluster0.ukm67ft.mongodb.net";
// const dbName2 = "createContent";

// async function updateData() {
//     // connect to mongodb
//     const client = new MongoClient(uri2, { useNewUrlParser: true, useUnifiedTopology: true });
//     await client.connect();
//     console.log('Connected to MongoDB');

//     const db = client.db(dbName2);
//     const collection = db.collection('other_File_conect_to_Api');

//     // update data _id = "660c0a9a2214a75258ae1878"
//     const query = { _id: new ObjectId("660c0a9a2214a75258ae1878") };    

//     // row = url_api
//     const urlNgrok = await ngrok.connect(5000);
//     const update = { $set: { url_api: urlNgrok } };

//     // update data
//     const result = await collection.updateOne(query, update);
//     console.log('Data updated successfully');
// }

// updateData().catch(console.error);

// Hello route
app.get('/', (req, res) => {

    res.send('Hello World');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ success: false, message: 'Please provide username and password' });
    }
    if (username === process.env.EMAIL && password === process.env.PASSWORD) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Upload route
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
      if(err){
        res.json({ success: false, message: err });
      } else {
        if(req.file == undefined){
          res.json({ success: false, message: 'No File Selected!' });
        } else {
          res.json({ success: true, message: 'File Uploaded!', file: `uploads/${req.file.filename}` });
        }
      }
    });
});

// Upload multiple files
app.post('/upload-multiple', uploadMulter, (req, res) => {
    try {
      const files = req.files.map(file => `uploads/${file.filename}`);
      res.json({
        success: true,
        message: 'Images uploaded successfully',
        files: files
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
});

// Translate route
app.post('/translate', async (req, res) => {
    try {
        const { text } = req.body;
        const target = "fr"
        const translatedText = await translate(text, { to: target });

        res.json({
            success: true,
            message: 'Post created successfully',
            translatedText
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Translate all route
app.post('/translateAll', async (req, res) => {
    const { dataArray } = req.body
    try { 
        let translatedData = [];
        for (let i = 0; i < dataArray.length; i++) {
            const { value } = dataArray[i];
            const target = "fr"
            const translatedText = await translate(value, { to: target });
            translatedData.push(translatedText);
        }

        res.json({
            success: true,
            message: 'Post created successfully',
            translatedData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create route
app.post('/create', async (req, res) => {
    try {
        connectAndInsert(req.body.dataArray)
            .then(() => {
                res.json({
                    success: true,
                    message: 'Data inserted successfully'
                });
            });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// get ID route
app.post('/getId', async (req, res) => {
    id = "6604381c6235465e04d9e008"
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('number');

        const query = { _id: new ObjectId(id) };

        const result = await collection.findOne(query);
        console.log('Data fetched successfully');
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create ID route
app.put('/updateId', async (req, res) => {
    id = "6604381c6235465e04d9e008"
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('number');

        const query = { _id: new ObjectId(id) };
        const result = await collection.findOne(query);
        const update = { $inc: { data: 1 } };

        await collection.updateOne(query, update);
        console.log('Data updated successfully');
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get All Posts
app.post('/posts', async (req, res) => {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('your_collection_name');

        const result = await collection.find({}).toArray();
        console.log('Data fetched successfully');
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Post by ID
app.post('/post/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('your_collection_name');

        const query = { _id: new ObjectId(id) };

        const result = await collection.findOne(query);
        console.log('Data fetched successfully');
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/post/:id', async (req, res) => {
    const { id } = req.params;
    const { dataId, newValue, language } = req.body;
    let client;
    try {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('your_collection_name');

        const query = { _id: new ObjectId(id), "data.id": dataId };
        let update;
        if(language) {
            update = { $set: { "data.$.value": newValue } };
        }else if (!language) {
            update = { $set: { "data.$.valueFr": newValue } };
        }

        const result = await collection.updateOne(query, update);
        console.log('Data updated successfully');
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    } finally {
        client.close();
    }
});

app.put('/post/delete/:id', async (req, res) => {
    console.log('delete')
    const { id } = req.params;
    const { dataId } = req.body;
    let client;
    try {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('your_collection_name');

        const query = { _id: new ObjectId(id), "data.id": dataId };
        updateAr = { $set: { "data.$.value": "" } };
        updateFr = { $set: { "data.$.valueFr": "" } };

        const result = await collection.updateOne(query, updateAr, updateFr);
        console.log('Data updated successfully');
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    } finally {
        client.close();
    }
});



const port = process.env.PORT || 5000;
app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
});