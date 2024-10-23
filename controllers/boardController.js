import boardSchema from "../schemas/boardSchema.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const list = async (req, res) => {
	try{
		res.json(await boardSchema.find())
	}catch(err){
		res.status(500).json({ message: err.message })
	}
};

const find = async (req, res) => {
	try{
		const post = await boardSchema.findById(req.params.id);
		if(!post){
			return res.status(404).json({ message: 'Not found' });
		}
		res.json(post)
	}catch(err){
		res.status(500).json({ message: err.message });
	}
};

const write = async (req, res) => {
	try{
		const { title, content } = req.body;
		const newBoard = await boardSchema.create({
			title: title,
			content: content,
		});
		res.status(201).json({
			message: "new board created successfully",
			board: newBoard,
		})
	}catch(err){
		res.status(400).json({
			message: "ERROR: fail to create",
			error: err.message,
		})
	}
};

const remove = async (req, res) => {
	try{
		const post = await boardSchema.findByIdAndDelete(req.params.id);
		if(!post){
			return res.status(404).json({ message: 'Not found' });
		}
		res.json(post);
	}catch(err){
		res.status(500).json({ message: err.message });
	}
};

const update = async (req, res) => {
	try{
		const {id, title, content } = req.body;
		const post = await boardSchema.findByIdAndUpdate(
			id,
			{ title, content },
			{ new: true, runValidators: true }
		);
		if(!post){
			return res.status(404).json({ message: 'Not Found' });
		}
		res.json(post);
	}catch(err){
		res.status(500).json({ message: err.message });
	}
};

export { list, find, write, remove, update };



