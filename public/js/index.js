const handleBotonRegister = $boton => {
	$boton.addEventListener("click", async (event) => {
		event.preventDefault();
		event.target.setAttribute("disabled", "disabled");

		const formData = getFormData(["first_name", "last_name", "email", "age", "password"]);
		
		const resultado = await doFetch("http://localhost:8080/api/sessions/register", "post", false, formData);
		
		if (resultado.success) {
			setMensajeGlobal(resultado.message + "Redireccionando...");
			setTimeout(() => {
				window.location.href = "/login";
			},3000);
		} else {
			setMensajeGlobal(resultado.message, "error");
			event.target.removeAttribute("disabled");
		}
	});
}

$boton = document.getElementById("user-register");
if ($boton) {
	handleBotonRegister($boton);	
}

const handleBotonLogin = $boton => {
	$boton.addEventListener("click", async (event) => {
		event.preventDefault();
		event.target.setAttribute("disabled", "disabled");

		const formData = getFormData(["username", "password"]);
		
		const resultado = await doFetch("http://localhost:8080/api/sessions/login", "post", false, formData);
		
		if (resultado.success) {
			setMensajeGlobal("Sesion iniciada con exito!");
			setTimeout(() => {
				window.location.href = "/products";
			},3000);
		} else {
			setMensajeGlobal(resultado.message, "error");
			event.target.removeAttribute("disabled");
		}
	});
}

$boton = document.getElementById("login");
if ($boton) {
	handleBotonLogin($boton);	
}

const getFormData = campos => {
	const formData = {};
	
	campos.forEach(campo => {
		formData[campo] = document.getElementById(campo).value;
	})

	return formData;
}

const doFetch = async (url, method, headers, body) => {
	method  = method || "get";
	headers = {"Content-Type": "application/json"};
	body    = body ? JSON.stringify(body) : {};
	return await fetch(url, {method, headers, body}).then( r => r.json()).then( j => j).catch(err => console.log(err));
}

const setMensajeGlobal = (mensaje, clase) => {
	$mensaje = document.getElementById("mensaje");
	
	$mensaje.classList.remove(...$mensaje.classList);

	$mensaje.classList.add(clase);

	$mensaje.innerHTML = mensaje;

	$mensaje.style.visibility = "visible";

	setTimeout(() => {
		$mensaje.style.visibility = "hidden";		
	},3000);
}