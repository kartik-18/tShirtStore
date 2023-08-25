// base - Product.find()

// bigQ -  search=coder&page=2&ctaegory=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199&limit=5

class WhereClaus{
    constructor(base, bigQ){
        this.base = base;
        this.bigQ = bigQ;
    }

    search(){
        const searchword = this.bigQ.search ? {
            name : {
                $regex : this.bigQ.search,
                $options : 'i',
            },
        } : {};

        this.base = this.base.find({...searchword});
        return this;
    }

    filter(){
        const copyQ = {...this.bigQ} // making copy of bigQ so that we can make changes and just to be cautious

        // since we have taken care of search , pager, limit etc we will delete it from copy 
        delete copyQ["search"];
        delete copyQ["limit"];
        delete copyQ["page"];

        // our goal here is to take lte,gte,lt,gt etc and add $ in front of them. and for that we will use regex.
        // but still regex works on string we wil convert this json to string.
        
        // convert bigQ into string => copyQ
        let stringOfCopyQ = JSON.stringify(copyQ)

        // now applying regex for adding $
        stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g, m => `$${m}`)

        // making it back as json
        const jsonOfCopyQ =JSON.parse(stringOfCopyQ);

        this.base = this.base.find(jsonOfCopyQ)
        return this;

    }

    pager(resultperPage){
        let currentPage = 1;
        if(this.bigQ.page){
            currentPage = this.bigQ.page
        }

        const skipVal = resultperPage * (currentPage -1)

        this.base = this.base.limit(resultperPage).skip(skipVal)

        return this;
    }
}

module.exports = WhereClaus;