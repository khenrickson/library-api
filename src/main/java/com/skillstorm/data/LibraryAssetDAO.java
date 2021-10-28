package com.skillstorm.data;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import java.util.LinkedList;

import com.skillstorm.beans.LibraryAsset;

public class LibraryAssetDAO {

	private static final String url = "jdbc:mysql://localhost:3306/library-api";
	private static final String username = "root";
	private static final String password = "root";
	
	static {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch(ClassNotFoundException e) {
			e.printStackTrace();
		}
	}
	
	public LibraryAsset create(LibraryAsset newItem) {
		
		try(Connection conn = DriverManager.getConnection(url, username, password)){
			
			String sql = "insert into asset(title, author, media_type, language, collection, location, loan_type, inter_lib_loan) values(?, ?, ?, ?, ?, ?, ?, ?)";
			PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
			
			stmt.setString(1, newItem.getTitle());
			stmt.setString(2, newItem.getAuthor());
			stmt.setString(3, newItem.getMediaType());
			stmt.setString(4, newItem.getLanguage());
			stmt.setString(5, newItem.getCollection());
			stmt.setString(6, newItem.getLocation());
			stmt.setString(7, newItem.getLoanType());
			stmt.setBoolean(8, newItem.isInterLibLoan());
			
			stmt.executeUpdate();
			
			ResultSet keys = stmt.getGeneratedKeys();
			keys.next();
			int newId = keys.getInt(1);
			
			newItem.setAsset_id(newId);
			
		} catch(SQLException e) {
			e.printStackTrace();
		}
		
		return newItem;
	}
	
	public LinkedList<LibraryAsset> findAll(){
		LinkedList<LibraryAsset> allAssets = new LinkedList<>();
		
		try(Connection conn = DriverManager.getConnection(url, username, password)){
			
			String sql = "select asset_id, title, author, media_type, language, collection, location, loan_type, inter_lib_loan from asset";
			PreparedStatement stmt = conn.prepareStatement(sql);

			ResultSet rs = stmt.executeQuery();
			
			while(rs.next()) {
				int assetId = rs.getInt("asset_id");
				String title = rs.getString("title");
				String author = rs.getString("author");
				String mediaType = rs.getString("media_type");
				String language = rs.getString("language");
				String collection = rs.getString("collection");
				String location = rs.getString("location");
				String loanType = rs.getString("loan_type");
				boolean interLibLoan = rs.getBoolean("inter_lib_loan");
				
				allAssets.add(new LibraryAsset(assetId, title, author, mediaType, language, collection, location, loanType, interLibLoan));
			}
			
		} catch(SQLException e) {
			e.printStackTrace();
		}
		
		return allAssets;
	}
	
	public LibraryAsset findById() {
		LibraryAsset item = new LibraryAsset();
		
		return item;
	}
	
	public LinkedList<LibraryAsset> findByValues(String[] searchValues){
		LinkedList<LibraryAsset> assetList = new LinkedList<>();
		
		return assetList;
	}

	
	public boolean update(LibraryAsset updatedAsset) {
		
		boolean updateSuccess = false;
		
		try(Connection conn = DriverManager.getConnection(url, username, password)){
			
			String sql = "update asset set title = ?, author = ?, media_type = ?, language = ?, collection = ?, location = ?, loan_type = ?, inter_lib_loan = ? where asset_id = ?";
			PreparedStatement stmt = conn.prepareStatement(sql);
			
			stmt.setString(1, updatedAsset.getTitle());
			stmt.setString(2, updatedAsset.getAuthor());
			stmt.setString(3, updatedAsset.getMediaType());
			stmt.setString(4, updatedAsset.getLanguage());
			stmt.setString(5, updatedAsset.getCollection());
			stmt.setString(6, updatedAsset.getLocation());
			stmt.setString(7, updatedAsset.getLoanType());
			stmt.setBoolean(8, updatedAsset.isInterLibLoan());
			stmt.setInt(9, updatedAsset.getAssetId());
			
			int rowsChanged = stmt.executeUpdate();
			
			updateSuccess = (rowsChanged > 0);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return updateSuccess;
	}
	
	public boolean delete(int assetId) {
		
		boolean deleteSuccess = false;
		
		try(Connection conn = DriverManager.getConnection(url, username, password)){
			
			String sql = "delete from asset where asset_id = ?";
			PreparedStatement stmt = conn.prepareStatement(sql);
			stmt.setInt(1, assetId);
			
			int rowsChanged = stmt.executeUpdate();
			deleteSuccess = (rowsChanged > 0);
			
		} catch(SQLException e) {
			e.printStackTrace();
		}
		
		return deleteSuccess;
	}
	
	public boolean delete(LibraryAsset removeItem) {
		return this.delete(removeItem.getAssetId());
	}
}
