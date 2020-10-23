function(instance, properties, context) {
 	var iban = properties.IBAN_numero;
	if(iban==null) {
        instance.publishState('IBAN_OK',"no");
     	return false;
 	}   
    
 	function validaIBAN(iban_nr) {   
        // iban_1 é o IBAN somente com numeros e letras
        var iban_1 = String(iban_nr).toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        // Valida o tamanho máximo do IBAN(34)
        if (iban_1.length > 34) {
           return false;
		}
                
        // iban_2 é o IBAN já separado Pais(2 letras), DV(2 numeros) e restante dados da Conta(Banco/Agencia/Conta)
        var iban_2 = iban_1.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);
        // iban_3 é o IBAN reorganiozado Conta + Pais + DV com os valores das letras já substituidas pelos valores associados a cada uma delas
		var iban_3 = (iban_2[3] + iban_2[1] + iban_2[2]).replace(/[A-Z]/g, function (letter) {return letter.charCodeAt(0) - 55});
		
		var DC=modulo97(iban_3);
        if (DC==1) {return true};
        return false;
    } 
                                                                                        
	function modulo97(iban_s) {
        var checksum = iban_s.slice(0, 2), fragment;
        for (var offset = 2; offset < iban_s.length; offset += 7) {
            fragment = String(checksum) + iban_s.substring(offset, offset + 7);
            checksum = parseInt(fragment, 10) % 97;    
        }
        return checksum;
    }
                                  
   var IBANOK = validaIBAN(iban);
            
   if(IBANOK) {
       instance.publishState('IBAN_OK',"yes");
   }
   else {instance.publishState('IBAN_OK',"no");
   }
}