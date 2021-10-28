package com.skillstorm.test;

import java.util.LinkedList;

import com.skillstorm.beans.LibraryAsset;
import com.skillstorm.data.LibraryAssetDAO;

public class DAOTesting {
	public static void main(String[] args) {
		LibraryAssetDAO dao = new LibraryAssetDAO();
		
		/*
		LibraryAsset newItem = new LibraryAsset("House of Many Ways", "Diana Wynne Jones", "Softcover Book", "English", "Fiction", "Park Hill Library", "Two Hours", false);
		newItem = dao.create(newItem);
		
		LibraryAsset updatedItem = newItem;
		System.out.println(updatedItem);
		
		updatedItem.setInterLibLoan(true);
		updatedItem.setLoanType("Two Weeks");
		
		if(dao.update(updatedItem))
			System.out.println(updatedItem);
		*/
		
		/*
		LibraryAsset newItem = new LibraryAsset("My Crappy Book", "Tr011 :D", "Bridge", "Engl1sh", "Fiction", "Nowhere!", "Forever", true);
		newItem = dao.create(newItem);
		System.out.println(newItem);
		
		if(dao.delete(newItem)) {
			newItem = null;
			System.out.println("Item deleted!");
		}
		*/
		
		/*
		if(dao.delete(23)) {
			System.out.println("Item deleted!");
		}
		*/
		
		/*
		LinkedList<LibraryAsset> allAssets = dao.findAll();
		for(LibraryAsset item : allAssets) {
			System.out.println(item);
		}
		*/
	}
}
