//we store all shops information for current search
export const jsonData =
[
   {
     "tata": []
   },
   {
     "devoto": []
   },
   {
     "tiendaInglesa": []
   },
   {
     "disco": []
   }
];


export function processProductData(rawProductName,price,image,link, shopName){

    rawProductName = rawProductName.toLowerCase().split(" ");

    //we use this to filter measure data
    const measureDesc = {
        "lt":"weight",
        "l":"weight",
        "ml":"weight",
        "kg":"weight",
        "k":"weight",
        "g":"weight",
        "gr":"weight",
        "u":"amount",
        "un":"amount",
        "mt":"size",
        "cm":"size",
        "mm":"size",
        "\"":"size"
    };

    //special characters that can be considered name of the product
    const charList = ["%",",","x"];

    //place where we order the information
    //and then save it
    let product = {
        "name": "",
        "price": 0,
        "amount": 1,
        "weight": 0,
        "size":"",
        "measuretUnit": "",
        "image": "",
        "link": ""
      }

    let productName  = "";

    //function that get number and measure unit of product
    rawProductName.forEach(function(word, i){
        word = word.toLowerCase();
        if (word in measureDesc) {
            //current index of matched search
            let currentIndex = i;
            //get measure data(weight, size, amount) of product
            for (let j = currentIndex; j>=0; j--){

                let re = new RegExp(charList.join("|","i","g"));

                //measureValueCond stores all conditions.
                let mVCond = [
                !(charList.includes(rawProductName[j])),
                !(/^[A-zÀ-ú]+$/.test(rawProductName[j])),
                !(re.test(rawProductName[j]))];

                //check if all conditions are true or not
                let result = mVCond.every(function (condition){
                    return condition !== false;
                });

                let nameCond = [(((/^[A-zÀ-ú]+$/.test(rawProductName[j])))),
                !(rawProductName[j] in measureDesc),
                re.test(rawProductName[j])
            ];

                if(result) {
                    let measureAmount = rawProductName[j];
                    product[measureDesc[word]] = Number(measureAmount);
                    product.measuretUnit = word;

                //get name of product
                }else if (nameCond[0] && nameCond[1] || nameCond[2])  {
                    productName = rawProductName[j] + " " + productName;
                }
            }
        //if product only is the name then..
        } else if((i+1 == rawProductName.length) && productName == ""){
            rawProductName.forEach((word) => {productName = productName + " " + word})

        }
    });

    product.name = productName.toUpperCase().trim();
    product.image = image;
    product.link = link;
    product.price = price;
    //console.log(product);
    //add product to shopsList
    jsonData[0][shopName].push(product);

}
