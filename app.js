function login(){
    if(document.getElementById('user').value==='admin' && document.getElementById('pass').value==='admin'){
        document.getElementById('loginScreen').style.display='none';
        document.getElementById('dashboardScreen').style.display='block';
    } else alert('credenciales inválidas');
}
function logout(){document.getElementById('dashboardScreen').style.display='none';document.getElementById('loginScreen').style.display='block';}