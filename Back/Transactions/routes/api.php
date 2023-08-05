<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompteController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/transactions/depot', [TransactionController::class, 'depot']);

Route::post('/transactions/retrait', [TransactionController::class, 'retrait']);

Route::post('/transactions/transfert', [TransactionController::class, 'transfert']);

Route::get('/numClient/{num}', [ClientController::class, 'getClientByNum']);

Route::get('/transClient/{num}', [ClientController::class, 'transClient']);

Route::post('/addClient', [ClientController::class, 'addClient']);

Route::get('/listerCompte', [CompteController::class, 'listerCompte']);

Route::post('/addCompte', [CompteController::class, 'addCompte']);

Route::get('/deleteCompte/{compte_id}', [CompteController::class, 'deleteCompte']);

Route::get('/bloquerCompte/{compte_id}', [CompteController::class, 'bloquerCompte']);

Route::get('/debloquerCompte/{compte_id}', [CompteController::class, 'debloquerCompte']);

Route::get('/annulerTransaction/{codeTransaction}', [TransactionController::class, 'annulerTransaction']);
