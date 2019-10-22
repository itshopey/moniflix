<script>
    closedFunction=function() {
        alert('window closed');
    }

     successFunction=function(transaction_id) {
        alert('Transaction was successful, Ref: '+transaction_id)
    }

     failedFunction=function(transaction_id) {
         alert('Transaction was not successful, Ref: '+transaction_id)
    }
</script>

 <script>
    function pay(item,price){
       //Initiate voguepay inline payment
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

 </script>

 <button type="button" onclick="pay('shirt',500)"> Pay for shirt </button>
 <button type="button" onclick="pay('shoe',10000)"> Pay for shoe </button>
                            