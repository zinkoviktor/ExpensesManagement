var input = document.getElementById("myInput");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
    	validator();
    	document.getElementById("myInput").value='';
    }
});

function validator(){
	var value = document.getElementById("myInput").value;
	var arr = value.split(" ");	
	switch (arr[0].toLowerCase()){
		case "add":
			return add(arr);
			break;
		case "list":
			return list();
			break;
		case "clear":
			return clear(arr);
			break;
		case "total":
			return total(arr);
			break;
		default:
			if(arr[0].length>1){
				responseText("Incorrect command!</br>Supported command: add, list, clear, total");
				return 0;
			}else{
				responseText("You can use the following command: add, list, clear, total");
				return 0;
			};
			break;
	}
}

function add(arr){
	if(/\d{4}-\d{2}-\d{2}/.test(arr[1])&&arr.length>=5){
		if(Date.parse(arr[1])<=new Date()&&Date.parse(arr[1])>new Date("2000-05-31")){
			if(!isNaN(arr[2])){
				if(/\w{3}/.test(arr[3])){
					arr[3]=arr[3].toUpperCase();
					if(arr[3]==="USD"||arr[3]==="EUR"||arr[3]==="PLN"||arr[3]==="UAH"){
						var product = arr.slice(4).join(" ").replace(/[^\d\sA-Z]/gi, ""); //formats the products name
						product=product.replace(/\b\w/g, function(l){ return l.toUpperCase() }) //replaces the first letter 
						return saveData(arr.splice(0,4).concat(product));						
					}else{
						responseText("Currency not supported!</br>Supported Currencies:EUR USD PLN UAH");
						return 0;
					}
					
				}else{
					responseText("Incorrect currency!</br>Example: USD</br>Supported Currencies:EUR USD PLN UAH");					
					return 0;
				}			
			}else{	
				responseText("Incorrect amount!</br>Amount must be a number!");
				return 0;
			}			
		}else{
			responseText("Incorrect Date!</br>Example: yyyy-mm-dd</br>The date should be greater 2000-05-31");
			return 0;
		}
	}else{			
		responseText("Incorrect command!</br>Example: add 2017-04-25 12 USD Jogurt");
		return 0;
		
	}
}

function list(){
	var returnObj;
	var print="";
	var lsLength = localStorage.length;
	var arrKey=[];

	for(var i=0;i<lsLength;i++){
		arrKey[i] = localStorage.key(i);
		arrKey.sort();
	}
	for(var i=0;i<arrKey.length;i++){
		print+="<p>"+arrKey[i]+"</br>";
		returnObj = JSON.parse(localStorage.getItem(arrKey[i]));
		returnObj.arr.forEach(function(arr) {print+=arr[2]+" "+arr[0]+" "+arr[1]+"</br>"});
		print+="</p>";
	}	
	if(lsLength){	
		responseText(print);
		return lsLength;
	}else{
		responseText("Expenses not found!!!");
		return 0;
	}	
}

function clear(arr){
	if(arr.length>1&&arr[1]){
		if(arr[1]=="all"){
			if(confirm("Are you sure?")){
				localStorage.clear();
				responseText("Storage cleared!");
				return 1;
			}
			else{
				responseText("Aborted!");
				return 0;
			}
		}else if(/\d{4}-\d{2}-\d{2}/.test(arr[1])&&Date.parse(arr[1])<=new Date()&&Date.parse(arr[1])>new Date("2000-05-31")){
			if(localStorage.getItem(arr[1])!=null){
				localStorage.removeItem(arr[1]);
				responseText("Expense cleared!!!");
				return 1;	
			}
			else{
				responseText("Expense not found!!!");
				return 0;
			}
				 
		}else{
			responseText("Incorrect Date!</br>Example: yyyy-mm-dd");
			return 0;
		}
	}else{
		responseText("Incorrect command!</br>Example: \"clear yyyy-mm-dd\" or \"clear all\"");
		return 0;
	}
}

function total(globalArr){
	
	var sum=0;
	var lsLength = localStorage.length;
	var temp=0;	
	if(globalArr.length>=2&&globalArr[1]!=''){
		var globalSymbol = globalArr[1].toUpperCase();
		if(globalSymbol==="USD"||globalSymbol==="EUR"||globalSymbol==="PLN"||globalSymbol==="UAH"){
			//runs a loop in localStorage
			for(var i=0;i<lsLength;i++){
				returnObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
				returnObj.arr.forEach(function(arr) {
					//adds to the total if the currencies are equal
					if(globalSymbol==arr[1]){
						sum+=+arr[0];								
						document.getElementById("printText").innerHTML=sum.toFixed(2)+" "+globalSymbol;	
					} else {
						//if the currencies aren't equal, load currencies historical rates
						var requestURL = "http://data.fixer.io/api/"+localStorage.key(i)+"?access_key=a41129b8ce9e7ed2c843cf944bbd5fee&symbols=USD,UAH,PLN&format=1";
						var request = new XMLHttpRequest();
						request.open('GET', requestURL, false);	
						
						request.onreadystatechange = function() {						
									if (this.readyState == 4) {
								        if (this.status == 200) {
								            var response = JSON.parse(this.responseText);

								            //converts currency and adds the result to the total						            
								            if(response.success==true){
								            	if(response.base==globalSymbol){
								            		sum+=+arr[0]/+response.rates[arr[1]];							            		      
								            	}
								            	else if(arr[1]==response.base){
								            		sum+=+arr[0]*+response.rates[globalSymbol];							            		
								            	}else{
								            		temp=+arr[0]/+response.rates[arr[1]];						            		
								            		sum+=temp*+response.rates[globalSymbol];								            		
								            	} 
								            	responseText(sum.toFixed(2)+" "+globalSymbol);								            	
								            }
								            else{
								            	responseText("Have a problem on server");
								            	console.log(response.error.info);						            	
								            	return 0;
								            }
								            
								        }
								        else {
								            responseText("Have a problem on server");
								            console.log("Status is: "+this.status);						            
								            return 0;
								        }

								    }

						}								
						request.send(null);	

					}	
				});		
			}
		responseText(sum.toFixed(2)+" "+globalSymbol);
		return 1;
		}else{
		responseText("Currency not supported!</br>Supported Currencies:EUR USD PLN UAH");
		return 0;
		}
		
	}else{
	responseText("Incorrect command!</br>Example: total USD");
	return 0;
}
	
}

function saveData(arr){
	if(localStorage.getItem(arr[1])===null){
		var data = {	
			arr: [arr.slice(2)]	
		};
			var serialObj = JSON.stringify(data);//serialization
			localStorage.setItem(arr[1], serialObj);
			var returnObj = JSON.parse(localStorage.getItem(arr[1]));
			list();
			return arr;
	}else{
			var returnObj = JSON.parse(localStorage.getItem(arr[1]));
			returnObj.arr.push(arr.slice(2));
			var serialObj = JSON.stringify(returnObj);//serialization
			localStorage.setItem(arr[1], serialObj);
			returnObj = JSON.parse(localStorage.getItem(arr[1]));
			list();
			return arr;		
	}
	return 0;
}
function responseText(text){
	var link =	document.getElementById("printText");
	link.innerHTML=text;	
}