# E-Commerce API Documentation

# Costumer Authentication
In order to prevent data leaked. User need  Authentication in some places. Authentications that can be use are Register / Login. 

If **Authentication is required**, add `token` on headers. You can get `token` from Authentication.
Headers:
```
{
  access_token: 'given_token'
}
```
## Register
URL:  `/api/user/register`
Method: `POST`
Status Code:  **`201`**

Request (Example): 
```
{
  name : "Just Arya",
  username : "justarya",
  password : "password",
  email : "justarya@mail.com"
}
```

Respond (Example):
```
{
  access_token : "slkdfjsadfjoi290r302r3u320jf.3420r230h832h89.23f9h824f",
  payload : {
      _id:  5eh938quy9hf380a,
      name : "Just Arya",
      username:  "justarya",
      email:  "justarya@mail.com",
      role:  "costumer",
      loginWith: "normal"
    }
}
```

## Login
URL:  `/api/user/login`
Method: `POST`
Status Code:  **`200`**

Request (Example): 
```
{
  email : "justarya@mail.com",
  password : "password"
}
```

Respond (Example):
```
{
	access_token : "slkdfjsadfjoi290r302r3u320jf.3420r230h832h89.23f9h824f",
	payload : {
			_id:  5eh938quy9hf380a,
			name : "Just Arya",
			username:  "justarya",
			email:  "justarya@mail.com",
			role:  "costumer",
			loginWith: "normal"
		}
}
```

# Product
## Create Product

Url: `/api/products`
Method: `POST`
Status: **`201`**
Authentication: **`Required`**

Error:
- **`406`** : 
  - Product Name cannot be empty
  - Product Price cannot be less than 0
  - Product Stock cannot be less than 0
  - Product Category must be an array


Data: 
```
{
  name: 'Macbook Pro 2019',
  price: 20000000,
  stock: 10,
  category: ['Laptop','Gadget','Apple'],
}
```

Response: 
```
{
  _id: 12342141
  name: 'Macbook Pro 2019',
  price: 20000000,
  stock: 5,
  category: ['Laptop','Gadget','Apple'],
  sellerId: 'j0f2q94802ru309',
  createdAt: date,
  updatedAt: date,
}
```

## Edit Product

Url: `/api/products/:id`
Method: `PUT`
Status: **`200`**
Authentication: **`Required`**

Error:
- **`404`** :
  - Product not found
- **`406`** : 
  - Product Name cannot be empty
  - Product Price cannot be less than 0
  - Product Stock cannot be less than 0
  - Product Category must be an array

Data: 
```
{
  name: 'Macbook Pro 2019',
  price: 20000000,
  stock: 10,
  category: ['Laptop','Gadget','Apple'],
}
```

Response: 
```
{
  _id: 12342141
  name: 'Macbook Pro 2019',
  price: 20000000,
  stock: 10,
  category: ['Laptop','Gadget','Apple'],
  sellerId: 'j0f2q94802ru309',
  createdAt: date,
  updatedAt: date,
}
```

## Find All Products

Url: `/api/products/`
Method: `GET`
Status: **`200`**

Response: 
```
[
  {
    _id: 12342141
    name: 'Macbook Pro 2019',
    price: 20000000,
    stock: 10,
    category: ['Laptop','Gadget','Apple'],
    sellerId: 'j0f2q94802ru309',
    createdAt: date,
    updatedAt: date,
  },
  ...
]
```

## Search Products

Url: `/api/products?search=keyword`
Method: `GET`
Status: **`200`**

Response:
```
[
  {
    _id: 12342141
    name: 'Macbook Pro 2019',
    price: 20000000,
    stock: 10,
    category: ['Laptop','Gadget','Apple'],
    sellerId: 'j0f2q94802ru309',
    createdAt: date,
    updatedAt: date,
  },
  ...
]
```

## Find One Product

Url: `/api/products/:id`
Method: `GET`
Status: **`200`**

Response:
```
{
  _id: 12342141
  name: 'Macbook Pro 2019',
  price: 20000000,
  stock: 10,
  category: ['Laptop','Gadget','Apple'],
  sellerId: 'j0f2q94802ru309',
  createdAt: date,
  updatedAt: date,
}
```

## Delete Product

Url: `/api/products/:id`
Method: `GET`
Status: **`200`**
Authentication: **`Required`**

Error:
- **`404`** :
  - Product not found

Response:
```
{
  delete: 1,
  message: 'Successfully delete Product'
}
```

# CART
## Create Cart

Url: `/api/cart/`
Method: `POST`
Status: **`200`**
Authentication: **`Required`**

Error:
- **`406`** : 
  - Product Id cannot be empty
  - Quantity cannot be empty

Data: 
```
{
  productId: 09123u213rh298,
  quantity: 2
}
```
Response:
```
{
  _id: i9fn29h82fh4r2083,
  productId: f8209ru092u4092,
  status: 'hold',
  quantity: 2,
  userId: d0j923k32jr932904
  createdAt: date,
  updatedAt: date,
}
```

## Update Cart

Url: `/api/cart/:id`
Method: `PATCH`
Status: **`200`**
Authentication: **`Required`**

Error:
- **`404`**
  - Product not found
- **`406`** : 
  - Quantity cannot be empty

Data: 
```
{
  quantity: 2
}
```
Response:
```
{
  _id: i9fn29h82fh4r2083,
  productId: f8209ru092u4092,
  status: 'hold',
  userId: d0j923k32jr932904
  createdAt: date,
  updatedAt: date,
}
```

## Delete Cart

Url: `/api/cart/:id`
Method: `DELETE`
Status: **`200`**
Authentication: **`Required`**

Response:
```
{
  delete: 1,
  message: 'Successfully delete Product'
}
```
## Checkout Cart
Url: `/api/cart/:id/checkout/`
Method: `PATCH`
Status: **`200`**
Authentication: **`Required`**

Error:
- **`404`**
  - Cart not found

Response:
```
{
  _id: i9fn29h82fh4r2083,
  productId: f8209ru092u4092,
  status: 'checkout',
  userId: d0j923k32jr932904
  createdAt: date,
  updatedAt: date,
}
```

## Find All Cart
Url: `/api/cart/`
Method: `GET`
Status: **`200`**
Authentication: **`Required`**

Response:
```
[
  {
    _id: i9fn29h82fh4r2083,
    productId: f8209ru092u4092,
    status: 'hold',
    userId: d0j923k32jr932904
    createdAt: date,
    updatedAt: date,
  },
  ...
]
```

## Get History Cart
Url: `/api/cart/history`
Method: `GET`
Status: **`200`**
Authentication: **`Required`**

Response:
```
[
  {
    _id: i9fn29h82fh4r2083,
    productId: f8209ru092u4092,
    status: 'hold',
    userId: d0j923k32jr932904
    createdAt: date,
    updatedAt: date,
  },
  ...
]
```

# Error handler

Error Status:
`401` : 
  - Unauthorized access
  - Authentication needed

`403` : 
  - Wrong Email/Password
  - No Access to certain post

`404` : 
  - Cart not found
  - Product not found

`406`: 
  - Error Validation
  
`500`:
  - Internal Server Error
 


Error (Example):
```
{
	error: 'Internal Server Error'
}
```