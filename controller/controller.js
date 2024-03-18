const db = require("./db")


const creditAccount = async (user_id, amount_id, amount) =>{
    const transaction = await db.transactionData();
    try{
        await db.creditLedger({
            user_id,
            amount_id,
            amount,
            transactionDate: new Date()
        },{transaction});

        await transaction.commit();
    }
    catch(err){
        await transaction.rollback();
        throw err;
    }
};



const checkAndStoreAction = async (user_id, action_id)=>{
    const action = await db.ActionsTable.findById(action_id);

    if(!action)
        throw new Error('Action not found');

        const balance = await getBalance(user_id);
        if(balance< action.creditCost)
            throw new Error("Insufficient balance");

        const transaction = await db.transaction();

        try{
            await db.Credit_Ledger.create({
                user_id,
                action_id,
                amount: -action.credit_cost,
                transaction_date: new Date()
              }, { transaction });
              await transaction.commit();          
        }
        catch(err){
            await transaction.rollback();
            throw err;
        }
}


const getBalance  = async(user_id)=>{
    const transaction = await db.creditLedger.findAll({
        where:{user_id}
    });
    return transaction.reduce((acc, transaction)=> acc+transaction.amount,0);
};



const checkLowBalance = async(user_id,threshold)=>{

    const balance = await getBalance(user_id);
    if(balance<thresholdAmount){
        // Use nodemailer to send mail to the user regarding the low balance
    }

};


const expireCredits = async()=>{
    const present = new Date();
    const allExpiredCredits = await db.creditExpiry.findAll({
        where:{
            expiryDate:{[db.date.lt]: present}
        }
    });

    const transaction = await db.transaction();

    try{
        for(const expireCredit of allExpiredCredits){

            await expireCredit.destroy({transaction});
        }
        await transaction.commit();
    }
    catch(err){
        await transaction.rollback();
        throw err;
        
    }
}


module.exports = {expireCredits,checkLowBalance, checkAndStoreAction, getBalance, creditAccount}




