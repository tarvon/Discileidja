// NB! This sample uses the legacy `hex` property!
window.hwcrypto.getCertificate({lang: 'en'}).then(function(certificate) {
    // Do something with the certificate, like prepare the hash to be signed
    var hash = calculateSHA256SignatureHashAsHexForCertificate(certificate.hex);
    // Now sign the hash
    window.hwcrypto.sign(certificate, {type: 'SHA-256', hex: hash}, {lang: 'en'}).then(function(signature) {
        // Do something with the signature
        storeSignature(signature.hex);
    }, function(error) {
        // Handle the error. `error.message` is one of the described error mnemonics
        console.log("Signing failed: " + error.message);
    });
});