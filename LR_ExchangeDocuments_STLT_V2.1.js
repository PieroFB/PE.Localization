/-Ver tema de colecciones-/

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =\
||   This script for customer center (Time)                     ||
||                                                              ||
||  File Name: LR_ExchangeDocuments_STLT_V2.1.js                ||
||                                                              ||
||  Version Date         Author        Remarks                  ||
||  2.0     Feb 19 2019  LatamReady    Use Script 2.0           ||
 \= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */
/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/search', 'N/runtime', 'N/redirect', 'N/ui/serverWidget', 'N/log', 'N/record','N/suiteAppInfo','N/translations'],
function(search, runtime, redirect, serverWidget, log, record,suiteAppInfo, translation) {

  const LMRY_script = 'LatamReady - Bill of Exchange STLT';
  let cantSubs = 0;
  let isBundleInstalled = (suiteAppInfo.isBundleInstalled({
   bundleId: 277395
}) || suiteAppInfo.isBundleInstalled({
 bundleId: 284007
}));
  function onRequest(scriptContext) {
    try {

      let subsi_OW = runtime.isFeatureInEffect({feature: "SUBSIDIARIES"});
      let prefMultiSub = runtime.isFeatureInEffect({ feature: "multisubsidiarycustomer" });
      let state = false;
      //activacion de enable features
      let enab_dep = runtime.isFeatureInEffect({feature: "DEPARTMENTS"});
      let enab_loc = runtime.isFeatureInEffect({feature: "LOCATIONS"});
      let enab_clas = runtime.isFeatureInEffect({feature: "CLASSES"});
     //proceso asignacion de estado "EN CARTERA" para peru
     let featureApprovalInvoice = runtime.getCurrentScript().getParameter({
       name: 'CUSTOMAPPROVALCUSTINVC'
       });
      //activacion de Accounting Preferences
      let userObj = runtime.getCurrentUser();
      let pref_dep = userObj.getPreference({name: "DEPTMANDATORY"});
      let pref_loc = userObj.getPreference({name: "LOCMANDATORY"});
      let pref_clas = userObj.getPreference({name: "CLASSMANDATORY"});

      let Language = runtime.getCurrentScript().getParameter({
        name: 'LANGUAGE'
      });
      Language = Language.substring(0, 2);
      if(Language=='es'){
        var lblform = 'LatamReady - Letra de Cambio';
        var lblprimary = 'Informacion Primaria';
        var lblsubsi = 'SUBSIDIARIA';
        var lblaraccount = 'CUENTA CXC';
        var lblcustomer = 'CLIENTE';
        var lblcurrency = 'MONEDA';
        var lblserie = 'SERIE';
        var lblperiod = 'PERIODO';
        var lbldate = 'FECHA';
        var lblexchange = 'TIPO DE CAMBIO';
        var lblaval = 'AVAL';
        var lblAvailableQuota = 'CUOTAS DISPONIBLES';
        var lblclassification = 'Clasificacion';
        var lbldepartment = 'DEPARTMENTO';
        var lblclass = 'CLASE';
        var lbllocation = 'UBICACION';
        var lblinline = 'Importante: Este proceso tardar&aacute; dependiendo de la cantidad de facturas a canjear';
        var lblResultados = 'Facturas';
        var lblgenerate="Estado de generacion de Letra";
        var lblaprobate="Letras aprobadas";
        var lblstatus="Estado de generacion de letra";
        var lblbank = 'INFORMACION BANCARIA';
        var lblbankcode = 'Bank Code';
        var lblbankoffice = 'Bank Office';
        var lblbanknumber = 'Bank Number Account';
        var lblbankcontrol = 'Bank Control Digit';
        var sublblapply = 'APLICAR';
        var sublblid = 'ID INTERNO';
        var sublbltran = 'TRANSACCION';
        var sublbltype = 'TIPO DOCUMENTO';
        var sublblserie = 'SERIE';
        var sublblpreim = 'PREIMPRESO';
        var sublbldate = 'FECHA';
        var sublblduedate = 'FECHA VENCIMIENTO';
        var sublblcurr = 'MONEDA';
        var sublblexch = 'TIPO DE CAMBIO';
        var sublbltotal = 'MONTO TOTAL';
        var sublblamount = 'MONTO DEBIDO';
        var sublblpay = 'PAGO';
        var lblerror = 'Importante: El acceso no esta permitido.';
        var lblquotas = 'CUOTAS';
        var lblinterest = 'INTERES';
        var btnfilter = 'Filtrar';
        var btnsave = 'Guardar';
        var btnreset = 'Reiniciar';
      } else{
        var lblform = 'LatamReady - Bill of Exchange';
        var lblprimary = 'Primary Information';
        var lblsubsi = 'SUBSIDIARY';
        var lblaraccount = 'A/R ACCOUNT';
        var lblcustomer = 'CUSTOMER';
        var lblcurrency = 'CURRENCY';
        var lblserie = 'SERIE';
        var lblperiod = 'PERIOD';
        var lbldate = 'DATE';
        var lblexchange = 'EXCHANGE RATE';
        var lblaval = 'AVAL';
        var lblAvailableQuota = 'AVAILABLE QUOTAS';
        var lblgenerate="Status of bill of exchange generation";
        var lblaprobate="Approved bills of exchange";
        var lblstatus="Bill of exchange status";
        var lblclassification = 'Classification';
        var lbldepartment = 'DEPARTMENT';
        var lblclass = 'CLASS';
        var lbllocation = 'LOCATION';
        var lblinline = 'Important: This process will take depending on the number of invoices to be exchanged';
        var lblResultados = 'Invoices';
        var lblbank = 'BANK INFORMATION';
        var lblbankcode = 'Bank Code';
        var lblbankoffice = 'Bank Office';
        var lblbanknumber = 'Bank Number Account';
        var lblbankcontrol = 'Bank Control Digit';
        var sublblapply = 'APPLY';
        var sublblid = 'INTERNAL ID';
        var sublbltran = 'TRANSACTION';
        var sublbltype = 'DOCUMENT TYPE';
        var sublblserie = 'SERIE';
        var sublblpreim = 'PREPRINTED';
        var sublbldate = 'DATE';
        var sublblduedate = 'DUE DATE';
        var sublblcurr = 'CURRENCY';
        var sublblexch = 'EXCHANGERATE';
        var sublbltotal = 'TOTAL AMOUNT';
        var sublblamount = 'AMOUNT DUE';
        var sublblpay = 'PAYMENT';
        var lblerror = 'Important: Access is not allowed.';
        var lblquotas = 'QUOTAS';
        var lblinterest = 'INTEREST';
        var btnfilter = 'Filter';
        var btnsave = 'Save';
        var btnreset = 'Reset';
      }

      if (scriptContext.request.method == 'GET') {

        let Rd_SubId = scriptContext.request.parameters.custparam_subsi;
        let Rd_CustId = scriptContext.request.parameters.custparam_customer;
        let Rd_PerId = scriptContext.request.parameters.custparam_acper;
        let Rd_CurrenId = scriptContext.request.parameters.custparam_currency;
        let Rd_Serie = scriptContext.request.parameters.custparam_serie;
        let Rd_ArAccount = scriptContext.request.parameters.custparam_araccount;
        let Rd_DateId = scriptContext.request.parameters.custparam_date;
        let Rd_RatId = scriptContext.request.parameters.custparam_exchangerate;
        let Rd_Aval = scriptContext.request.parameters.custparam_aval;
        let Rd_LocId = scriptContext.request.parameters.custparam_location;
        let Rd_DepId = scriptContext.request.parameters.custparam_depart;
        let Rd_ClaId = scriptContext.request.parameters.custparam_class;
        let Rd_Available = scriptContext.request.parameters.custparam_available;
        let Rd_BoE_statusgenerate=scriptContext.request.parameters.custparam_BoE_statusgenerate;
                   //filtro status letra de cambio
                   let Rd_BoEstatus=scriptContext.request.parameters.custparam_BoE_status;
                   let Rd_invoiceaprobate;
                   if(featureApprovalInvoice){
                       Rd_invoiceaprobate=scriptContext.request.parameters.custparam_invoiceaprobate;
                   }  
        ///var Rd_Concat = scriptContext.request.parameters.custparam_concat;

        let form = serverWidget.createForm({
          title: lblform
        });
        form.addFieldGroup({
          id: 'group_pi',
          label: lblprimary
        });


        let p_subsi;
        let p_araccount;
        let p_cust;
        

        if (subsi_OW) {
          p_subsi = form.addField({
            id: 'custpage_id_subsi',
            label: lblsubsi,
            source: 'subsidiary',
            type: serverWidget.FieldType.SELECT,
            container: 'group_pi'
          });
          p_subsi.isMandatory = true;

          let cantSubsObj = p_subsi.getSelectOptions({
              filter : '',
              filteroperator: 'startswith'
          });
          cantSubs = cantSubsObj.length;

          let p_araccount = form.addField({
            id: 'custpage_id_araccount',
            label: lblaraccount,
            type: serverWidget.FieldType.SELECT,
            container: 'group_pi'
          });
          p_araccount.isMandatory = true;

          if (runtime.getCurrentUser().roleId != 'administrator' && runtime.getCurrentUser().roleId != 'full_access' && cantSubs==1){
            p_cust = form.addField({
              id: 'custpage_id_customer',
              label: lblcustomer,
              type: serverWidget.FieldType.SELECT,
              source: 'customer',
              container: 'group_pi'
            });
            p_cust.isMandatory = true;
            
          } else{
            p_cust = form.addField({
              id: 'custpage_id_customer',
              label: lblcustomer,
              type: serverWidget.FieldType.SELECT,
              container: 'group_pi'
            });
            p_cust.isMandatory = true;
          }

        } else {
          p_araccount = form.addField({
            id: 'custpage_id_araccount',
            label: lblaraccount,
            type: serverWidget.FieldType.SELECT,
            container: 'group_pi'
          });
          p_araccount.isMandatory = true;
          let accountSearchObj = search.create({
            type: 'account',
            filters:[['type','anyof','AcctRec'], 'AND', ['isinactive','is','F']],
            columns:[
              search.createColumn({name: 'internalid', label: 'Internal ID'}),
              search.createColumn({name: 'name',sort: search.Sort.ASC,label: 'Name'})
            ]
          });
          accountSearchObj = accountSearchObj.run().getRange(0,1000);
          p_araccount.addSelectOption({value: 0,text: ' '});
          if(accountSearchObj != null && accountSearchObj != ''){
            for(let i=0; i<accountSearchObj.length; i++){
              let idArAccount = accountSearchObj[i].getValue({name: 'internalid'});
              let nameArAccount = accountSearchObj[i].getValue({name: 'name'});
              p_araccount.addSelectOption({value: idArAccount,text: nameArAccount});
            }
          }

          p_cust = form.addField({
            id: 'custpage_id_customer',
            label: lblcustomer,
            source: 'customer',
            type: serverWidget.FieldType.SELECT,
            container: 'group_pi'
          });
          p_cust.isMandatory = true;
        }

        // Seteo en el rellamado
        if (Rd_SubId != '' && Rd_SubId != null) {
          p_subsi.defaultValue = Rd_SubId;
          p_subsi.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED
          });

          //en esta parte del codigo tmb realiza una busqueda en el rellamado
          let accountSearchObj = search.create({
            type: 'account',
            filters:[['type','anyof','AcctRec'], 'AND', ['isinactive','is','F'], 'AND', ['subsidiary','anyof',Rd_SubId]],
            columns:[
              search.createColumn({name: 'internalid', label: 'Internal ID'}),
              search.createColumn({name: 'name',sort: search.Sort.ASC,label: 'Name'})
            ]
          });
          accountSearchObj = accountSearchObj.run().getRange(0,1000);
          p_araccount.addSelectOption({value: 0,text: ' '});
          if(accountSearchObj != null && accountSearchObj != ''){
            for(let i=0; i<accountSearchObj.length; i++){
              let idArAccount = accountSearchObj[i].getValue({name: 'internalid'});
              let nameArAccount = accountSearchObj[i].getValue({name: 'name'});
              p_araccount.addSelectOption({value: idArAccount,text: nameArAccount});
            }
          }

        }

        // Seteo en el rellamado
        if (Rd_ArAccount != '' && Rd_ArAccount != null) {
          p_araccount.defaultValue = Rd_ArAccount;
          p_araccount.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED
          });
        }

        let p_currency = form.addField({
          id: 'custpage_id_currency',
          label: lblcurrency,
          type: serverWidget.FieldType.SELECT,
          container: 'group_pi'
        });
        p_currency.isMandatory = true;



        // Seteo en el rellamado 
        if (Rd_CustId != '' && Rd_CustId != null) {
           //Se hizo el cambio de llenado del campo por un lookupfield en vez de 
           let OjbCust = search.lookupFields({
               type :  'customer',
               id : Rd_CustId ,
               columns : ['internalid', 'companyname', 'firstname', 'lastname', 'middlename', 'isperson']
           })
           nameCustomer = '';
           idCustomer = OjbCust.internalid[0].value,
           isPerson = OjbCust.isperson;

           if (isPerson == true || isPerson == 'T') {
              nameCustomer = OjbCust.firstname + " ";
              middleName = OjbCust.middlename;
              if (middleName != null && middleName != '') {
                  nameCustomer = nameCustomer + middleName.substring(0, 1) + " ";
              }
              nameCustomer = nameCustomer +OjbCust.lastname;
           } else {
               nameCustomer = OjbCust.companyname;
           }

          p_cust.addSelectOption({value: idCustomer,text: nameCustomer});
          //hasta aqui termina el cambio-------------------------

          p_cust.defaultValue = Rd_CustId;
          p_cust.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED
          });


          //aqui tmb llena un campo con busqueda
          let array_currency = new Array();
          let searchCurrencyCustomer = search.create({
            type: search.Type.CUSTOMER,
            filters: [['internalid','is',Rd_CustId],'AND',['isinactive','is','F']],
            columns: [{name: 'currency'}, {name: 'currency',join: 'customercurrencybalance'}]
          });
          searchCurrencyCustomer = searchCurrencyCustomer.run().getRange(0,1000);
          //Agrega la moneda principal
          if (searchCurrencyCustomer.length > 0) {
            let col = searchCurrencyCustomer[0].columns;
            array_currency.push(searchCurrencyCustomer[0].getText(col[0]));
          }
          //Agrega las monedas secundarias
          for (let i = 0; i < searchCurrencyCustomer.length; i++) {
            let col = searchCurrencyCustomer[i].columns;
            if (array_currency[0] != searchCurrencyCustomer[i].getValue(col[1])) {
              array_currency.push(searchCurrencyCustomer[i].getValue(col[1]));
            }
          }

          let array_currency_internal = new Array();

          //Sort: porque al leer la busqueda lo iteraba por nombre no por id
          let currencySearch = search.create({
            type: search.Type.CURRENCY,
            columns: [{name: 'internalid',sort: search.Sort.ASC}, {name: 'name'}]
          }).run().getRange(0,1000);

          if (currencySearch != null && currencySearch.length > 0) {
            for (let i = 0; i < array_currency.length; i++) {
              for (let j = 0; j < currencySearch.length; j++) {
                if (currencySearch[j].getValue('name') == array_currency[i]) {
                  array_currency_internal.push(currencySearch[j].getValue('internalid'));
                }
              }
            }
          }
          p_currency.addSelectOption({value:0, text:' '});
          for (let k = 0; k < array_currency_internal.length; k++) {
            p_currency.addSelectOption({
              value: array_currency_internal[k],
              text: array_currency[k]
            });
          }
        }

        let p_serie = form.addField({
          id: 'custpage_id_serie',
          label: lblserie,
          type: serverWidget.FieldType.SELECT,
          container: 'group_pi'
        });
        p_serie.isMandatory = true;

        // Seteo en el rellamado
        if (Rd_CurrenId != '' && Rd_CurrenId != null) {
          p_currency.defaultValue = Rd_CurrenId;
          p_currency.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED
          });
          let docTypeSetup = 0;

          //aqui tmb llena el campo con una busqueda
          let setupSearch = search.create({
            type: 'customrecord_lmry_setup_exch_doc',
            filters: [['custrecord_lmry_setup_exch_subsidiary','is',Rd_SubId],'AND',
                      ['custrecord_lmry_setup_exch_currency','is',Rd_CurrenId]],
            columns: ['custrecord_lmry_setup_exch_doc_type']
          });
          setupSearch = setupSearch.run().getRange(0,1);
          if(setupSearch!=null && setupSearch!=''){
            docTypeSetup = setupSearch[0].getValue('custrecord_lmry_setup_exch_doc_type');
            let serieSearch = search.create({
              type: 'customrecord_lmry_serie_impresion_cxc',
              filters: [['custrecord_lmry_subsidiaria','is',Rd_SubId],'AND',
                        ['custrecord_lmry_serie_tipo_doc_cxc','is',docTypeSetup]],
              columns: ['internalid','name']
            });
            serieSearch = serieSearch.run().getRange(0,1000);
            p_serie.addSelectOption({value: 0,text: ' '});
            if(serieSearch!=null && serieSearch!=''){
              for(let i=0; i<serieSearch.length; i++){
                let idSerie = serieSearch[i].getValue({name: 'internalid'});
                let nameSerie = serieSearch[i].getValue({name: 'name'});
                p_serie.addSelectOption({value: idSerie,text: nameSerie});
              }
            }
          }
        }

        if (Rd_Serie != '' && Rd_Serie != null) {
          p_serie.defaultValue = Rd_Serie;
          p_serie.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED
          });
        }



        let p_period = form.addField({
          id: 'custpage_id_period',
          label: lblperiod,
          type: serverWidget.FieldType.SELECT,
          container: 'group_pi'
        });
        p_period.isMandatory = true;
        // Seteo en el rellamado
        if (Rd_PerId != '' && Rd_PerId != null) {
          p_period.defaultValue = Rd_PerId;
          p_period.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED
          });
        }

        let field_accounting_period = p_period;
        field_accounting_period.addSelectOption({
          value: 0,
          text: ' '
        });

        let search_period = search.create({
          type: 'accountingperiod',
          filters: [['isadjust','is','F'], 'AND', ['isquarter','is','F'], 'AND', ['isinactive','is','F'], "AND", ['isyear','is','F']],
          columns:
          [
            search.createColumn({name: "internalid",summary: "GROUP",sort: search.Sort.DESC,label: "Internal ID"}),
            search.createColumn({name: "periodname",summary: "GROUP",label: "Name"})
          ]
        });
        let resul_period = search_period.run();
        let lengt_period = resul_period.getRange({
          start: 0,
          end: 1000
        });

        if (lengt_period != null) {
          for (let i = 0; i < lengt_period.length; i++) {
            let varcolu = lengt_period[i].columns;
            let valores = lengt_period[i].getValue(varcolu[0]);
            let textos = lengt_period[i].getValue(varcolu[1]);
            field_accounting_period.addSelectOption({
              value: valores,
              text: textos
            });
          }
        }


        let p_date = form.addField({
          id: 'custpage_id_date',
          label: lbldate,
          type: serverWidget.FieldType.DATE,
          source: 'date',
          container: 'group_pi'
        });

        if (Rd_DateId != null && Rd_DateId != '') {
          p_date.defaultValue = Rd_DateId;
          p_date.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED
          });
        }

        let p_exrate = form.addField({
          id: 'custpage_id_rate',
          label: lblexchange,
          type: serverWidget.FieldType.FLOAT,
          source: 'exchangerate',
          container: 'group_pi'
        });
        p_exrate.isMandatory = true;

        if (Rd_RatId != '' && Rd_RatId != null) {
          p_exrate.defaultValue = Rd_RatId;
          p_exrate.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED
          });
        }

        let p_aval = form.addField({
          id: 'custpage_id_aval',
          label: lblaval,
          type: serverWidget.FieldType.SELECT,
          container: 'group_pi'
        });
        p_aval.isMandatory = true;
        if (Rd_CustId != null && Rd_CustId != '') {
          let avalrelaList = new Array();
          //aqui tmb llena el caampo con una busqueda
          let avalrelaSearch = search.create({
            type: 'customrecord_lmry_aval_relationship',
            filters: [['custrecord_lmry_aval_rela_customer','is',Rd_CustId],'AND',
                      ['custrecord_lmry_aval_rela_subsidiary','is',Rd_SubId],'AND',['isinactive','is','F']],
            columns: ['custrecord_lmry_aval_rela_entity']
          });
          avalrelaSearch = avalrelaSearch.run().getRange(0,1000);
          if(avalrelaSearch!=null && avalrelaSearch!=''){
            for(let i=0; i<avalrelaSearch.length; i++){
              avalrelaList.push(parseInt(avalrelaSearch[i].getValue('custrecord_lmry_aval_rela_entity')));
            }
          }
          let avalSearchObj = search.create({
            type: search.Type.ENTITY,
            filters: [ ['internalid','anyof',avalrelaList], 'AND', ['isinactive','is','F'] ],
            columns: ['internalid','type']
          });
          avalSearchObj = avalSearchObj.run().getRange(0,1000);
          p_aval.addSelectOption({value: 0,text: ' '});
          if(avalSearchObj != null && avalSearchObj != ''){
            for(let i=0; i<avalSearchObj.length; i++){
              let idAval = avalSearchObj[i].getValue({name:'internalid'});
              let nameAval = GetTexto(avalSearchObj[i].getValue({name:'type'}),avalSearchObj[i].getValue({name:'internalid'}));
              p_aval.addSelectOption({value: idAval,text: nameAval});
            }
          }
          p_aval.defaultValue = Rd_Aval;
          p_aval.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED
          });
        }

        let p_available = form.addField({
          id: 'custpage_id_available',
          label: lblAvailableQuota,
          type: serverWidget.FieldType.CHECKBOX,
          container: 'group_pi'
        });
         //chechbox para generar las letras aprobadas
         if(featureApprovalInvoice){
           let p_invoiceaprobate = form.addField({
               id: 'custpage_id_invoiceaprobate',
               label: lblaprobate,
               type: serverWidget.FieldType.CHECKBOX,
               container: 'group_pi'
           });
           if(Rd_invoiceaprobate !='' &&Rd_invoiceaprobate !=null){
               p_invoiceaprobate.defaultValue = Rd_invoiceaprobate;
               p_invoiceaprobate.updateDisplayType({
               displayType: serverWidget.FieldDisplayType.DISABLED
           });
           }
       }
        if (Rd_Available != '' && Rd_Available != null) {
          p_available.defaultValue = Rd_Available;
          p_available.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED
          });
        }
 //list para filtrar invoice por estado de letra
 if(isBundleInstalled){
   let p_filtro_estado=form.addField({
       id:'custpage_id_estadoletra',
       label: lblstatus,
       type: serverWidget.FieldType.SELECT,
       container:'group_pi'
   });

   let field_filtro_estado = p_filtro_estado;
   field_filtro_estado.addSelectOption({
   value: 0,
   text: ' '
});
// cambiar busqueda por el list estado letra
let search_estado = search.create({
   type: 'customlist_ltmr_boe_status',
   columns:[
       search.createColumn({ name: "internalid", summary: "GROUP", sort: search.Sort.ASC, label: "Internal ID" }),
       search.createColumn({ name: "name", summary: "GROUP"})
   ]//cambiar por id de la lista al momento de crearla

});

let resul_estado = search_estado.run();
let lengt_estado = resul_estado.getRange({
   start: 0,
   end: 1000
});

if (lengt_estado != null) {
   for (let i = 0; i < lengt_estado.length; i++) {
       let varcolu = lengt_estado[i].columns;
       let valores = lengt_estado[i].getValue(varcolu[0]);
       let textos = lengt_estado[i].getValue(varcolu[1]);
       if(valores!=6){
           field_filtro_estado.addSelectOption({
           value: valores,
           text: textos
       });
       }
       
   }
}
if(Rd_BoEstatus!=null && Rd_BoEstatus!=""){
   field_filtro_estado.defaultValue=Rd_BoEstatus;
   field_filtro_estado.updateDisplayType({
       displayType: serverWidget.FieldDisplayType.DISABLED
   });
}
//select para generar las letras en un estado en especifico

   let p_BoE_statusgenerate=form.addField({
       id:'custpage_id_statusgenerate',
       label:lblgenerate,
       type: serverWidget.FieldType.SELECT,
       container:'group_pi'
   });

   
   
if (lengt_estado != null) {
   for (let i = 0; i < lengt_estado.length; i++) {
       let varcolu = lengt_estado[i].columns;
       let valores = lengt_estado[i].getValue(varcolu[0]);
       let textos = lengt_estado[i].getValue(varcolu[1]);
       if(valores==3||valores==4||valores==7||valores==5||valores==8){
           continue
       }
       p_BoE_statusgenerate.addSelectOption({
           value: valores,
           text: textos
       });
   }
}

   if(Rd_BoE_statusgenerate!=null && Rd_BoE_statusgenerate!=""){
       p_BoE_statusgenerate.defaultValue=Rd_BoE_statusgenerate;
       p_BoE_statusgenerate.updateDisplayType({
           displayType:serverWidget.FieldDisplayType.DISABLED
       })
   }


}

        let p_state = form.addField({
          id: 'custpage_id_state',
          label: 'STATE',
          type: serverWidget.FieldType.TEXT,
          container: 'group_pi'
        });
        p_state.defaultValue = 'F';
        p_state.updateDisplayType({
          displayType : serverWidget.FieldDisplayType.HIDDEN
        });

        let p_concat = form.addField({
          id: 'custpage_id_concat',
          label: 'CONCAT',
          type: serverWidget.FieldType.TEXTAREA,
          container: 'group_pi'
        });
        p_concat.updateDisplayType({
          displayType : serverWidget.FieldDisplayType.HIDDEN
        });

        if(Rd_CustId != '' && Rd_CustId != null){
          p_state.defaultValue = 'T';
          state = true;
        }

        form.addFieldGroup({
          id: 'group_cla',
          label: lblclassification
        });


        // Solo para One World
        if (subsi_OW == true) {
          if (enab_dep == true) {
            let c_depart;
            if (runtime.getCurrentUser().roleId != 'administrator' && runtime.getCurrentUser().roleId != 'full_access' && cantSubs==1){
              c_depart = form.addField({
                id: 'custpage_id_depart',
                label: lbldepartment,
                type: serverWidget.FieldType.SELECT,
                source: 'department',
                container: 'group_cla'
              });
            } else{
              c_depart = form.addField({
                id: 'custpage_id_depart',
                label: lbldepartment,
                type: serverWidget.FieldType.SELECT,
                container: 'group_cla'
              });
            }

            if (pref_dep == true) {
              c_depart.isMandatory = true;
            }
            if (Rd_SubId != '' && Rd_SubId != null) {
              // Carga el location filtrado por subsidiaria
              if (runtime.getCurrentUser().roleId != 'administrator' && runtime.getCurrentUser().roleId != 'full_access' && cantSubs==1){
                if (Rd_DepId != '' && Rd_DepId != null) {
                  c_depart.defaultValue = Rd_DepId;

                }
              } else{
                c_depart.addSelectOption({value: 0,text: ' '});
                
                //aqui tmb llena el campo con una busqueda
                let Search_dep = search.create({
                  type: search.Type.DEPARTMENT,
                  columns: ['internalid', 'name'],
                  filters: [['subsidiary','anyof',Rd_SubId]]
                });
                let Result_dep = Search_dep.run().getRange(0,1000);

                if (Result_dep != null) {
                  for (let i = 0; i < Result_dep.length; i++) {
                    c_depart.addSelectOption({
                      value: Result_dep[i].getValue('internalid'),
                      text: Result_dep[i].getValue('name')
                    });
                  }
                  // Seteo en el rellamado
                  if (Rd_DepId != '' && Rd_DepId != null) {
                    c_depart.defaultValue = Rd_DepId;
                    /*c_depart.updateDisplayType({
                      displayType: serverWidget.FieldDisplayType.DISABLED
                    });*/
                  }
                }
              }
              c_depart.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
              });
            }
          }
          if (enab_loc == true) {
            let c_location;
            if (runtime.getCurrentUser().roleId != 'administrator' && runtime.getCurrentUser().roleId != 'full_access' && cantSubs==1){
              c_location = form.addField({
                id: 'custpage_id_location',
                label: lbllocation,
                type: serverWidget.FieldType.SELECT,
                source: 'location',
                container: 'group_cla'
              });
            } else{
              c_location = form.addField({
                id: 'custpage_id_location',
                label: lbllocation,
                type: serverWidget.FieldType.SELECT,
                container: 'group_cla'
              });
            }

            if (pref_loc == true) {
              c_location.isMandatory = true;
            }
            if (Rd_SubId != '' && Rd_SubId != null) {
              if (runtime.getCurrentUser().roleId != 'administrator' && runtime.getCurrentUser().roleId != 'full_access' && cantSubs==1){
                // Seteo en el rellamado
                if (Rd_LocId != '' && Rd_LocId != null) {
                  c_location.defaultValue = Rd_LocId;

                }
              } else{
                
                // Carga el location filtrado por subsidiaria
                c_location.addSelectOption({value: 0,text: ' '});
                
                let Search_loc = search.create({
                  type: search.Type.LOCATION,
                  columns: ['internalid', 'name'],
                  filters: [['subsidiary','anyof',Rd_SubId]]
                });
                let Result_loc = Search_loc.run().getRange(0,1000);

                if (Result_loc != null) {
                  for (let i = 0; i < Result_loc.length; i++) {
                    c_location.addSelectOption({
                      value: Result_loc[i].getValue('internalid'),
                      text: Result_loc[i].getValue('name')
                    });
                  }
                  // Seteo en el rellamado
                  if (Rd_LocId != '' && Rd_LocId != null) {
                    c_location.defaultValue = Rd_LocId;
                    /*c_location.updateDisplayType({
                      displayType: serverWidget.FieldDisplayType.DISABLED
                    });*/
                  }
                }
              }
              c_location.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
              });
            }
          }
          if (enab_clas == true) {
            let c_class;
            if (runtime.getCurrentUser().roleId != 'administrator' && runtime.getCurrentUser().roleId != 'full_access' && cantSubs==1){
              c_class = form.addField({
                id: 'custpage_id_class',
                label: lblclass,
                type: serverWidget.FieldType.SELECT,
                source: 'classification',
                container: 'group_cla'
              });
            } else{
              c_class = form.addField({
                id: 'custpage_id_class',
                label: lblclass,
                type: serverWidget.FieldType.SELECT,
                container: 'group_cla'
              });
            }

            if (pref_clas == true) {
              c_class.isMandatory = true;
            }
            if (Rd_SubId != '' && Rd_SubId != null) {
              if (runtime.getCurrentUser().roleId != 'administrator' && runtime.getCurrentUser().roleId != 'full_access' && cantSubs==1){
                // Seteo en el rellamado
                if (Rd_ClaId != '' && Rd_ClaId != null) {
                  c_class.defaultValue = Rd_ClaId;

                }
              } else{
                c_class.addSelectOption({value: 0,text: ' '});

                let Search_clas = search.create({
                    type: search.Type.CLASSIFICATION,
                    columns: ['internalid', 'name'],
                    filters: [['subsidiary','anyof',Rd_SubId]]
                });
                let Result_class = Search_clas.run().getRange(0,1000);

                if (Result_class != null) {
                  for (let i = 0; i < Result_class.length; i++) {
                    c_class.addSelectOption({
                      value: Result_class[i].getValue('internalid'),
                      text: Result_class[i].getValue('name')
                    });
                  }
                  // Seteo en el rellamado
                  if (Rd_ClaId != '' && Rd_ClaId != null) {
                    c_class.defaultValue = Rd_ClaId;
                    /*c_class.updateDisplayType({
                      displayType: serverWidget.FieldDisplayType.DISABLED
                    });*/
                  }

                }
              }
              c_class.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
              });
            }
          }
        }

        let p_texto = form.addField({
            id: 'custpage_id_texto',
            label: 'TEXTO',
            type: serverWidget.FieldType.INLINEHTML,
        });
        let strhtml = "<html>";
        strhtml += "<table border='0' class='table_fields' cellspacing='0' cellpadding='0'>" +
          "<tr>" +
          "</tr>" +
          "<tr>" +
          "<td class='text'>" +
          "<div style=\"color: gray; font-size: 8pt; margin-top: 10px; padding: 5px; border-top: 1pt solid silver\">" +
          lblinline +
          "</div>" +
          "</td>" +
          "</tr>" +
          "</table>" +
          "</html>";

        p_texto.defaultValue = strhtml;

        if(state){
          form.addFieldGroup({
            id: 'group_bank',
            label: lblbank
          });

          let p_bank_code = form.addField({
              id: 'custpage_id_bank_code',
              label: lblbankcode,
              type: serverWidget.FieldType.TEXT,
              container: 'group_bank'
          });

          let p_bank_office = form.addField({
              id: 'custpage_id_bank_office',
              label: lblbankoffice,
              type: serverWidget.FieldType.TEXT,
              container: 'group_bank'
          });

          let p_bank_number = form.addField({
              id: 'custpage_id_bank_number',
              label: lblbanknumber,
              type: serverWidget.FieldType.TEXT,
              container: 'group_bank'
          });

          let p_bank_control = form.addField({
              id: 'custpage_id_bank_control',
              label: lblbankcontrol,
              type: serverWidget.FieldType.TEXT,
              container: 'group_bank'
          });
        }
         //array de sublistas
         let sub_sublistas=[];

        //Creación del Log
        let SubTabla = form.addSublist({
          id: 'custpage_id_sublista',
          type: serverWidget.SublistType.LIST,
          label: lblResultados
        });

        SubTabla.addField({ id: 'id_appl', label: sublblapply, type: serverWidget.FieldType.CHECKBOX });
                   SubTabla.addField({ id: 'id_int', label: sublblid, type: serverWidget.FieldType.TEXT });
                   SubTabla.addField({ id: 'id_tran', label: sublbltran, type: serverWidget.FieldType.TEXT });
                   SubTabla.addField({ id: 'id_type', label: sublbltype, type: serverWidget.FieldType.TEXT });
                   SubTabla.addField({ id: 'id_serie', label: sublblserie, type: serverWidget.FieldType.TEXT });
                   SubTabla.addField({ id: 'id_preim', label: sublblpreim, type: serverWidget.FieldType.TEXT });
                   SubTabla.addField({ id: 'id_date', label: sublbldate, type: serverWidget.FieldType.DATE });
                   SubTabla.addField({ id: 'id_duedate', label: sublblduedate, type: serverWidget.FieldType.DATE });
                   SubTabla.addField({ id: 'id_curn', label: sublblcurr, type: serverWidget.FieldType.TEXT });
                   SubTabla.addField({ id: 'id_exch', label: sublblexch, type: serverWidget.FieldType.FLOAT });
                   SubTabla.addField({ id: 'id_tota', label: sublbltotal, type: serverWidget.FieldType.CURRENCY });
                   SubTabla.addField({ id: 'id_amou', label: sublblamount, type: serverWidget.FieldType.CURRENCY });
                   let desab = SubTabla.addField({ id: 'id_pay', label: sublblpay, type: serverWidget.FieldType.CURRENCY }).updateDisplayType({
                       displayType: serverWidget.FieldDisplayType.ENTRY
                   });
                   desab.updateDisplayType({
                       displayType: serverWidget.FieldDisplayType.DISABLED
                   });
                   sub_sublistas.push(SubTabla)
                   //Campo estados PE 
                   //Sublistas para diferenciar facturas de letras
                   
                   let namesubtabla=""
                   if (Language == 'es'){
                       namesubtabla="Letras";
                   }else{
                       namesubtabla="Letters"
                   }
                   if(isBundleInstalled){
                       
                       let idSubTabla = form.addSublist({
                               id: 'custpage_id_sublista'+1,
                               type: serverWidget.SublistType.LIST,
                               label: namesubtabla
                           });
       
                       idSubTabla.addField({ id: 'id_appl', label: sublblapply, type: serverWidget.FieldType.CHECKBOX });
                       idSubTabla.addField({ id: 'id_int', label: sublblid, type: serverWidget.FieldType.TEXT });
                       idSubTabla.addField({ id: 'id_tran', label: sublbltran, type: serverWidget.FieldType.TEXT });
                       idSubTabla.addField({ id: 'id_type', label: sublbltype, type: serverWidget.FieldType.TEXT });
                       idSubTabla.addField({ id: 'id_serie', label: sublblserie, type: serverWidget.FieldType.TEXT });
                       idSubTabla.addField({ id: 'id_preim', label: sublblpreim, type: serverWidget.FieldType.TEXT });
                       idSubTabla.addField({ id: 'id_date', label: sublbldate, type: serverWidget.FieldType.DATE });
                       idSubTabla.addField({ id: 'id_duedate', label: sublblduedate, type: serverWidget.FieldType.DATE });
                       idSubTabla.addField({ id: 'id_curn', label: sublblcurr, type: serverWidget.FieldType.TEXT });
                       idSubTabla.addField({ id: 'id_exch', label: sublblexch, type: serverWidget.FieldType.FLOAT });
                       idSubTabla.addField({ id: 'id_tota', label: sublbltotal, type: serverWidget.FieldType.CURRENCY });
                       idSubTabla.addField({ id: 'id_amou', label: sublblamount, type: serverWidget.FieldType.CURRENCY });
                       let desab = idSubTabla.addField({ id: 'id_pay', label: sublblpay, type: serverWidget.FieldType.CURRENCY }).updateDisplayType({
                               displayType: serverWidget.FieldDisplayType.ENTRY
        });
        desab.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED
        });
        sub_sublistas.push(idSubTabla);
                       
                   }

        if ((Rd_SubId != null && Rd_SubId != '') && (Rd_CustId != null && Rd_CustId != '') &&
            (Rd_PerId != null && Rd_PerId != '') && (Rd_CurrenId != null && Rd_CurrenId != '') &&
            (Rd_ArAccount != null && Rd_ArAccount != '')) {
          let invoiceSearchObj = search.create({
            type: "invoice",
            filters: [{name: 'mainline',operator: 'is',values: ['T']},
              {name: 'status',operator: 'anyof',values: ['CustInvc:A']},
              {name: 'subsidiary',operator: 'anyof',values: [Rd_SubId]},
              {name: 'entity',operator: 'anyof',values: [Rd_CustId]},
              {name: 'currency',operator: 'anyof',values: [Rd_CurrenId]},
              {name: 'account',operator: 'anyof',values: [Rd_ArAccount]}
            ],
            columns: ["internalid", "tranid", "transactionnumber", "trandate",
                      "duedate", "currency", "exchangerate", "fxamount", "fxamountremaining",
                      "custbody_lmry_document_type","custbody_lmry_serie_doc_cxc","custbody_lmry_num_preimpreso"]
          });
          if(Rd_Available == false || Rd_Available == 'F'){
            invoiceSearchObj.filters.push(search.createFilter({name: 'memo',operator: 'isnot',values: 'Created by LatamReady - Exchange Documents - Debit'}));
            invoiceSearchObj.filters.push(search.createFilter({name: 'memo',operator: 'isnot',values: 'Created by LatamReady - Exchange Documents - Quota'}));
          }
          //añadir filtro 
          if(Rd_BoEstatus!=null && Rd_BoEstatus!=""){
                                                       
           let letrasxstatus=search.create({
               type: 'customrecord_lmry_pe_transaction_fields',
               filters:search.createFilter({ name: 'custrecord_lmry_pe_boe_status', operator: 'is', values: Rd_BoEstatus }),
               columns: ['custrecord_lmry_pe_transaction_related'],
           });
           let resultadoinvoice=letrasxstatus.run().getRange(0,1000);
           let ids=[];
           for(let i=0;i<resultadoinvoice.length;i++){
               ids.push(resultadoinvoice[i].getValue({
                   name: 'custrecord_lmry_pe_transaction_related'
               }));
           }
           if(ids.length>0){
               invoiceSearchObj.filters.push(search.createFilter({ name: 'internalid', operator: 'anyof', values: ids  }))
           }
           log.error("ids",ids);
           

       }
          let invoiceSearchResult = invoiceSearchObj.run().getRange(0,1000);

          if (invoiceSearchResult != '' && invoiceSearchResult != null &&((Rd_BoEstatus!=0&&!isNaN(Rd_BoEstatus))?(ids.length>0?true:false):true)) {
           for(let index in sub_sublistas){
             let SubTablan=sub_sublistas[index];
             let i=0;
             for (let u = 0; u < invoiceSearchResult.length; u++) {

              let internalId = '' + invoiceSearchResult[u].getValue({
                 name: 'internalid'
             });
             let tranId = '' + invoiceSearchResult[u].getValue({
                 name: 'tranid'
             });
             let transactionNumber = '' + invoiceSearchResult[u].getValue({
                 name: 'transactionnumber'
             });
             let docTipo = invoiceSearchResult[u].getText({
                 name: 'custbody_lmry_document_type'
             });
             
             if(index==0&& !(docTipo=="Nota de debito"||docTipo=="Factura")){
                 continue;
             }

             if(index==1&&docTipo!="Letra"){
                 continue;
             }
             let serie = invoiceSearchResult[u].getText({
                 name: 'custbody_lmry_serie_doc_cxc'
             });
             let preimpreso = invoiceSearchResult[u].getValue({
                 name: 'custbody_lmry_num_preimpreso'
             });
             let tranDate = invoiceSearchResult[u].getValue({
                 name: 'trandate'
             });
             let dueDate = invoiceSearchResult[u].getValue({
                 name: 'duedate'
             });
             let currency = invoiceSearchResult[u].getText({
                 name: 'currency'
             });
             let exchangeRate = invoiceSearchResult[u].getValue({
                 name: 'exchangerate'
             });
             let total = invoiceSearchResult[u].getValue({
                 name: 'fxamount'
             });
             let amountDue = invoiceSearchResult[u].getValue({
                 name: 'fxamountremaining'
             });

             if (internalId != '') {
                 SubTablan.setSublistValue({
                     id: 'id_int',
                     line: i,
                     value: internalId
                 });
             }
             if (tranId != '') {
                 SubTablan.setSublistValue({
                     id: 'id_tran',
                     line: i,
                     value: tranId
                 });
             } else {
                 if (transactionNumber != '') {
                     SubTablan.setSublistValue({
                         id: 'id_tran',
                         line: i,
                         value: transactionNumber
                     });
                 }
             }
             if (docTipo != '') {
                 SubTablan.setSublistValue({
                     id: 'id_type',
                     line: i,
                     value: docTipo
                 });
             }
             if (serie != '') {
                 SubTablan.setSublistValue({
                     id: 'id_serie',
                     line: i,
                     value: serie
                 });
             }
             if (preimpreso != '') {
                 SubTablan.setSublistValue({
                     id: 'id_preim',
                     line: i,
                     value: preimpreso
                 });
             }
             if (tranDate != '') {
                 SubTablan.setSublistValue({
                     id: 'id_date',
                     line: i,
                     value: tranDate
                 });
             }
             if (dueDate != '') {
                 SubTablan.setSublistValue({
                     id: 'id_duedate',
                     line: i,
                     value: dueDate
                 });
             }
             if (currency != '') {
                 SubTablan.setSublistValue({
                     id: 'id_curn',
                     line: i,
                     value: currency
                 });
             }
             if (exchangeRate != '') {
                 SubTablan.setSublistValue({
                     id: 'id_exch',
                     line: i,
                     value: exchangeRate
                 });
             }
             if (total != '') {
                 SubTablan.setSublistValue({
                     id: 'id_tota',
                     line: i,
                     value: total
                 });
             }
             if (amountDue != '') {
                 SubTablan.setSublistValue({
                     id: 'id_amou',
                     line: i,
                     value: amountDue
                 });
                 SubTablan.setSublistValue({
                     id: 'id_pay',
                     line: i,
                     value: amountDue
                 });
             }
             i++;
         }
         }
         
          }
        }

        if(state==false){
          form.addSubmitButton({
            label: btnfilter
          });
        } else{
          let p_quotas = form.addField({
              id: 'custpage_id_quotas',
              label: lblquotas,
              type: serverWidget.FieldType.INTEGER,
              container: 'group_pi'
          });
          p_quotas.isMandatory = true;

          let p_interest = form.addField({
              id: 'custpage_id_interest',
              label: lblinterest,
              type: serverWidget.FieldType.PERCENT,
              container: 'group_pi'
          });
          p_interest.isMandatory = true;

          form.addSubmitButton({
            label: btnsave
          });
        }


        form.addResetButton({
          label: btnreset
        });

        // Script Cliente
        form.clientScriptModulePath = './LR_ExchangeDocuments_CLNT_V2.1.js';

        scriptContext.response.writePage(form);
      } else {

        if(scriptContext.request.parameters.custpage_id_state=='F'){
          let params = {};
          if(subsi_OW){
            params['custparam_subsi'] = scriptContext.request.parameters.custpage_id_subsi;
          }
          params['custparam_customer'] = scriptContext.request.parameters.custpage_id_customer;
          params['custparam_acper'] = scriptContext.request.parameters.custpage_id_period;
          params['custparam_currency'] = scriptContext.request.parameters.custpage_id_currency;
          params['custparam_serie'] = scriptContext.request.parameters.custpage_id_serie;
          params['custparam_araccount'] = scriptContext.request.parameters.custpage_id_araccount;
          params['custparam_date'] = scriptContext.request.parameters.custpage_id_date;
          params['custparam_exchangerate'] = scriptContext.request.parameters.custpage_id_rate;
          params['custparam_aval'] = scriptContext.request.parameters.custpage_id_aval;
          params['custparam_available'] = scriptContext.request.parameters.custpage_id_available;
          params['custparam_concat'] = scriptContext.request.parameters.custpage_id_concat;
          if(featureApprovalInvoice){
           params['custparam_invoiceaprobate']=scriptContext.request.parameters.custpage_id_invoiceaprobate;
       }
       //si esta activado el modulo de letras
       if(isBundleInstalled){
           params['custparam_BoE_status']=scriptContext.request.parameters.custpage_id_estadoletra;
           params['custparam_BoE_statusgenerate']=scriptContext.request.parameters.custpage_id_statusgenerate;
       }
          if (enab_loc == true){
            params['custparam_location'] = scriptContext.request.parameters.custpage_id_location;
          }
          if (enab_dep == true){
            params['custparam_depart'] = scriptContext.request.parameters.custpage_id_depart;
          }
          if (enab_clas == true){
            params['custparam_class'] = scriptContext.request.parameters.custpage_id_class;
          }

          // realiza la consulta con los parametros seleccionados
          redirect.toSuitelet({
            scriptId: runtime.getCurrentScript().id,
            deploymentId: runtime.getCurrentScript().deploymentId,
            parameters: params
          });
        }else{
          let params = {};
          if(subsi_OW){
            params['custparam_subsi'] = scriptContext.request.parameters.custpage_id_subsi;
          }
          params['custparam_customer'] = scriptContext.request.parameters.custpage_id_customer;
          params['custparam_acper'] = scriptContext.request.parameters.custpage_id_period;
          params['custparam_currency'] = scriptContext.request.parameters.custpage_id_currency;
          params['custparam_serie'] = scriptContext.request.parameters.custpage_id_serie;
          params['custparam_araccount'] = scriptContext.request.parameters.custpage_id_araccount;
          params['custparam_date'] = scriptContext.request.parameters.custpage_id_date;
          params['custparam_exchangerate'] = scriptContext.request.parameters.custpage_id_rate;
          params['custparam_aval'] = scriptContext.request.parameters.custpage_id_aval;
          params['custparam_interest'] = scriptContext.request.parameters.custpage_id_interest;
          params['custparam_concat'] = scriptContext.request.parameters.custpage_id_concat;
          params['custparam_bank_code'] = scriptContext.request.parameters.custpage_id_bank_code;
          params['custparam_bank_office'] = scriptContext.request.parameters.custpage_id_bank_office;
          params['custparam_bank_number'] = scriptContext.request.parameters.custpage_id_bank_number;
          params['custparam_bank_control'] = scriptContext.request.parameters.custpage_id_bank_control;
          if (enab_loc == true){
            params['custparam_location'] = scriptContext.request.parameters.custpage_id_location;
          }
          if (enab_dep == true){
            params['custparam_depart'] = scriptContext.request.parameters.custpage_id_depart;
          }
          if (enab_clas == true){
            params['custparam_class'] = scriptContext.request.parameters.custpage_id_class;
          }
          params['custparam_quotas'] = scriptContext.request.parameters.custpage_id_quotas;
          if(featureApprovalInvoice){
           params['custparam_invoiceaprobate']=scriptContext.request.parameters.custpage_id_invoiceaprobate;
       }
       //estado de letra para generar
       if(isBundleInstalled){
           params['custparam_BoE_statusgenerate']=scriptContext.request.parameters.custpage_id_statusgenerate;
       }
          redirect.toSuitelet({
            scriptId: 'customscript_lmry_exch_doc_prev_stlt',
            deploymentId: 'customdeploy_lmry_exch_doc_prev_stlt',
            parameters: params
          });
        }

      }

    } catch (err) {
      let form = serverWidget.createForm({title: lblform});
      let myInlineHtml = form.addField({id: 'custpage_id_message',label: 'MESSAGE', type: serverWidget.FieldType.INLINEHTML});
        myInlineHtml.layoutType = serverWidget.FieldLayoutType.OUTSIDEBELOW;
        myInlineHtml.updateBreakType({breakType : serverWidget.FieldBreakType.STARTCOL});

        let strhtml = "<html>";
        strhtml += "<table border='0' class='table_fields' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "</tr>" +
        "<tr>" +
        "<td class='text'>" +
        "<div style=\"color: gray; font-size: 12pt; margin-top: 10px; padding: 5px; border-top: 1pt solid silver\">"+lblerror+"</div>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</html>";

        myInlineHtml.defaultValue = strhtml;

      // Dibuja el Formulario
      scriptContext.response.writePage(form);
      log.error('[onRequest]',err);
    }
    return true;
  }

  function GetTexto(tipo,idEntity){
    let typeEntity = '';
    let texto = '';
    
    switch(tipo){
      case 'Contact':
        let contactData = search.lookupFields({
          type: search.Type.CONTACT,
          id: idEntity,
          columns: ['firstname','lastname']
        });
        texto = contactData.firstname+' '+contactData.lastname;
        break;
      case 'CustJob':
        let custJobData = search.lookupFields({
          type: search.Type.CUSTOMER,
          id: idEntity,
          columns: ['firstname','lastname','companyname','isperson']
        });
        if(custJobData.isperson==false || custJobData.isperson=='F'){
          texto = custJobData.companyname;
        } else{
          texto = custJobData.firstname+' '+custJobData.lastname;
        }
        break;
      case 'Vendor':
        let vendorData = search.lookupFields({
          type: search.Type.VENDOR,
          id: idEntity,
          columns: ['firstname','lastname','companyname','isperson']
        });
        if(vendorData.isperson==false || vendorData.isperson=='F'){
          texto = vendorData.companyname;
        } else{
          texto = vendorData.firstname+' '+vendorData.lastname;
        }
        break;
      case 'Employee':
        let employeeData = search.lookupFields({
          type: search.Type.EMPLOYEE,
          id: idEntity,
          columns: ['firstname','lastname']
        });
        texto = employeeData.firstname+' '+employeeData.lastname;
        break;
      case 'Partner':
        let partnerData = search.lookupFields({
          type: search.Type.PARTNER,
          id: idEntity,
          columns: ['companyname']
        });
        texto = partnerData.companyname;
        break;
      default: return ''; break;
    }
    return texto;
  }

  return {
    onRequest: onRequest
  };

});