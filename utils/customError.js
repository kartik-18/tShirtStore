class CustomError extends Error{
    constructor(message,code){ // sort of overrding constructor. the default one has only one argument message.
        super(message);
        this.code=code;
    }
}


module.exports = CustomError
// since nodejs errors are good already we dont need to do more of custom error
