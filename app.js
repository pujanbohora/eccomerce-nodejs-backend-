const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

require("./database/database");

const CustomerRoute = require("./router/customerRoute");
const AdminRoute = require("./router/admin/adminRoute");
const ProductRouter = require('./router/productRouter');
const categoryRoutes = require('./router/categoryRoute');
const cartRoutes = require('./router/cartRouter');
const addressRoutes =require('./router/addressRoutes');
const orderRoutes = require('./router/ordreRoutes');
const paginationRoutes = require('./router/pagerRoutes');
const SubCategory = require('./router/sub_categoryRouter');
const homePage = require('./router/home_page');
const wishlist = require('./router/wishlistRoute');
const bodyparser = require('body-parser');
 

app.use(bodyparser.urlencoded({extended: true}));
app.use(CustomerRoute);
app.use(ProductRouter);
app.use(categoryRoutes);
app.use(cartRoutes);
app.use(addressRoutes);
app.use(orderRoutes);
app.use(paginationRoutes);
app.use(homePage);
app.use(SubCategory);
app.use(wishlist);

app.use(express.static(__dirname+"/images"))


app.use(AdminRoute);

app.listen("90"); 