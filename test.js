
QUnit.test( "add() function test", function(assert) {		  	
	assert.ok( add(["2","1"]) == 0, "Passed!" );
	assert.ok( add(["add2233"]) == 0, "Passed!" );  
	assert.deepEqual( add(["add","2017-11-11", "12", "USD", "printer"]),["add", "2017-11-11", "12", "USD", "Printer"], "Passed!" );
	assert.ok( add(["add","207-11-11", "12", "USD", "printer"]) == 0, "Passed!" );
	assert.deepEqual( add(["add","2017-11-11", "12", "UsD", "printerddd ddd ddd", "hhgh"]),["add", "2017-11-11", "12", "USD", "Printerddd Ddd Ddd Hhgh"], "Passed!" );
	document.getElementById("myInput").value="clear 2017-11-11";   
	assert.equal( validator(),1, "Passed!" );
});

QUnit.test( "validator() function test", function(assert) {
	document.getElementById("myInput").value="clear all";   
	assert.equal( validator(),1, "Passed!" );  
	document.getElementById("myInput").value="clear";
	assert.equal( validator(),0, "Passed!" );
	document.getElementById("myInput").value="clear 2001-11-01";
	assert.equal( validator(),0, "Passed!" );
	document.getElementById("myInput").value="clear 2019-11-01";
	assert.equal( validator(),0, "Passed!" );
	assert.ok( add(["add","2017-11-11", "12", "USD", "printer"]), "Passed!" );
	document.getElementById("myInput").value="clear 2017-11-11";
	assert.equal( validator(),1, "Passed!" );
	  
	document.getElementById("myInput").value="list";
	assert.equal( validator(),0, "Passed!" );
	add(["add","2017-11-11", "12", "USD", "printer"]);  
	assert.ok( validator()>0, "Passed!" );
	  
	document.getElementById("myInput").value="total";
	assert.equal( validator(),0, "Passed!" );
	document.getElementById("myInput").value="total ";
	assert.equal( validator(),0, "Passed!" );
	document.getElementById("myInput").value="total ghy";
	assert.equal( validator(),0, "Passed!" );
	document.getElementById("myInput").value="total uah";
	assert.equal( validator(),1, "Passed!" );
});
QUnit.test( "final test", function(assert) {
	var totalText;
	assert.ok( clear(["clear","all"]), "Passed!" );
	document.getElementById("myInput").value="add 2017-04-25 2 USD Jogurt";
	assert.ok( validator(), "Passed!" );
	document.getElementById("myInput").value="add 2017-04-25 3 EUR \"French fries\"";
	assert.ok( validator(), "Passed!" );
	document.getElementById("myInput").value="add 2017-04-27 4.75 EUR Beer";
	assert.ok( validator(), "Passed!" );
	document.getElementById("myInput").value="add 2017-04-26 2.5 PLN Sweets";
	assert.ok( validator(), "Passed!" );
	document.getElementById("myInput").value="clear 2017-04-27";
	assert.ok( validator(), "Passed!" );
	document.getElementById("myInput").value="total EUR";
	assert.ok( validator(), "Passed!" );
	totalText=document.getElementById("printText").innerHTML;
	alert(totalText);
	assert.equal( totalText,"5.42 EUR", "Passed!" );
});
