window.onload = (event) => {
	console.log('load');
	const loginbuttonSmall = document.querySelector('#loginBtnSmall');
	const logoutbuttonSmall = document.querySelector('#logoutBtnSmall');
	const loginbuttonLarge = document.querySelector('#loginBtnLarge');
	const logoutbuttonLarge = document.querySelector('#logoutBtnLarge');
	const token = window.localStorage.getItem('token');
	if (token) {
		loginbuttonLarge.style.display = 'none';
		loginbuttonSmall.style.display = 'none';
		logoutbuttonLarge.style.display = 'block';
		logoutbuttonSmall.style.display = 'block';
	} else {
		loginbuttonLarge.style.display = 'block';
		loginbuttonSmall.style.display = 'block';
		logoutbuttonLarge.style.display = 'none';
		logoutbuttonSmall.style.display = 'none';
	}
};

async function authenticate() {
	console.log('authenticate');
	const token = window.localStorage.getItem('token');
	if (!token) {
		const loginbuttonLarge = document.querySelector('#loginBtnLarge');
		return loginbuttonLarge.click();
	}
	return (document.location.href = '/mate');
}
