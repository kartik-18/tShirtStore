// User.find({email : "one@gmail.com"})
// User.find({price : {$lte : 999}})

// the below queery is a normal thing and we need to grab the gte lte etc from query and add {$} in front of it because we cant directly add it in query itself due to problem which might occur due url encoding or url parsing whatever that is

// so we will use regex
'/api/v1/product/search=coder&page=2&ctaegory=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199'

const p  = 'gte lte gte mygte'

const regex = /\b(gte | lte)\b/g; // here /g is meant by global & \b  is used to set boundries that only if it comes in start we will consider it.

console.log(p.replace(regex, m => `$${m}`));//replace will give us a callback and in the callback we will replace starting with $

// console.log(req.query);
// all the queries will come here in json object type.
// we will convert it into string so that we can use .replace method as it can be used only on strings
// but then we will again convert that string into object so that we can pass it in .find method that requires object.