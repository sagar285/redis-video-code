const Category = require("../models/category");
const client =require("../rediClient");


const setinredis =async(name)=>{
    await client.sAdd("categories", name);
    await client.expire("categories", 3600);
}

// create category with redis catch using sAdd method
exports.createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = await Category.create({ name, description });
        await setinredis(category.name);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await client.sMembers("categories");
        if(categories.length === 0){
            const categoriesData = await Category.find();
           for(const category of categoriesData){
            await setinredis(category.name);
           }
            return res.status(200).json(categoriesData);
        }
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.deleteCategory = async (req, res) => {
    const { name } = req.params;
    try {
        await Category.findOneAndDelete({ name });
        await client.sRem("categories", name);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// score based ranking of data

exports.scoreBasedRanking = async (req, res) => {

    try {
        
    await client.zAdd("scoreBasedRanking", {score: 10, value: "item1"});
    await client.zAdd("scoreBasedRanking", {score: 20, value: "item2"});
    await client.zAdd("scoreBasedRanking", {score: 30, value: "item3"});

    res.status(200).json({message: "Score based ranking done successfully"});
} catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getScoreBasedRanking = async (req, res) => {
    try {
        const result = await client.zRange("scoreBasedRanking", 0, 1);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// hash in redis

exports.hashInRedis = async (req, res) => {
    try {
        await client.hSet("userHash", {name: "John", age: 25, city: "New York"});
        res.status(200).json({message: "Hash in redis done successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getHashInRedis = async (req, res) => {
    try {
        const result = await client.hGetAll("userHash");
        res.status(200).json({result});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// bit in redis
exports.bitInRedis = async (req, res) => {
    try {
        await client.setBit("bitArray", 1, 1);
        res.status(200).json({message: "Bit in redis done successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}

