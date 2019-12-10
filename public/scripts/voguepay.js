
    var globalprice;

    const closedFunction=function() {
        alert('window closed');
        globalprice = null;
    }

     const successFunction=function(transaction_id) {
       console.log(transaction_id);
        fetch("/users/deposit/add-transaction", {
          method: "post",
          headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
         },
         body:  JSON.stringify({
           price: globalprice,
           transaction_id: transaction_id
         })
       }).then((response) => {
         // window.location('/')
         console.log(response);
       });
    }

    const  failedFunction=function(transaction_id) {
         alert('Transaction was not successful, Ref: '+transaction_id);
         globalprice = null;
    }


    function pay(item, price){
       //Initiate voguepay inline payment
        globalprice = price;
        Voguepay.init({
            v_merchant_id: 'demo',
            total: price,
            notify_url:'http://domain.com/notification.php',
            cur: 'NGN',
            merchant_ref: 'ref123',
            memo:'Payment for '+item,
            developer_code: '5a61be72ab323',
            store_id:1,
            items: [
                {
                    name: "Item name 1",
                    description: "Description 1",
                    price: 500
                },
                {
                    name: "Item name 2",
                    description: "Description 2",
                    price: 1000
                }
            ],
            customer: {
                name: 'Customer name',
                address: 'Customer address',
                city: 'Customer city',
                state: 'Customer state',
                zipcode: 'Customer zip/post code',
                email: 'Customer email',
                phone: 'Customer phone'
            },
           closed:closedFunction,
           success:successFunction,
           failed:failedFunction
       });
    }
