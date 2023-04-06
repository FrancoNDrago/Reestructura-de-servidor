const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const { viewsRouter } = require("./routers/viewsRouter");
const { userRouter } = require("./routers/userRouter");
const { productsRouter } = require("./routers/productsRouter");
const { cartsRouter } = require("./routers/cartsRouter");
const { sessionRouter } = require("./routers/sessionRouter");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo"); 
const PORT = 8080;

const httpServer = app.listen(PORT, () => console.log(`Escuchando en ${PORT}`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("Secreto"));
app.use(session({
	store: MongoStore.create({
		mongoUrl: "mongodb+srv://Drago:Coderhouse123@cluster0.gsvnnyg.mongodb.net/test",
		mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
		ttl: 100 
	}),
	secret: "secret123",
	resave: true,
	saveUninitialized: true
}));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);

app.get("*", (req,res) => {
	res.send("Busqueda no encontrada");
})