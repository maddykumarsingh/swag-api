const { generate } = require("otp-generator");




// Configration for otp

let configuration = { 
    upperCaseAlphabets: false, 
    specialChars: false,
    lowerCaseAlphabets: false,
}


// How much digit you want to send as OTP


export const generateOtp =  ( numberOfDigit:number ):number => { 
    let otp:number ;
    otp = generate( numberOfDigit , configuration )
    return otp
};

