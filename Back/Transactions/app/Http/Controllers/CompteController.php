<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompteRequest;
use App\Http\Requests\UpdateCompteRequest;
use Illuminate\Http\Request;
use App\Models\Compte;
use App\Models\Client;


class CompteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function addCompte(Request $request){

        $request->validate([
            "fournisseur" => "required|in:wv,om,wr,cb",
            "telephone" => "required"
        ]);
        $client = Client::where('telephone', $request->telephone)->first();

        $compteExist = Compte::where('num_compte', $request->fournisseur . '_' . $request->telephone)->first();
        if ($compteExist) {
            return response()->json(["message" => " Ce compte a déjà été créé"]);
        };

        $compte = Compte::create([
            "num_compte" => $request->fournisseur.'_'.$request->telephone,
            "fournisseur" => $request->fournisseur,
            "client_id" => $client->id,
            "solde" => 2000
        ]);

        return response()->json(["message" => "Compte ouvert avec succès", "data" => $compte]);

    }

    public function listerCompte(){
        return Compte::all();
    }

    public function deleteCompte($num)
    {
        $compte = Compte::where('num_compte', $num)->first();
        if (!$compte) {
            return response()->json(['message' => 'Le compte n\'existe pas.'], 404);
        }

        try {
            $compte->delete();
            return response()->json(['message' => 'Le compte a été supprimé avec succès.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Une erreur s\'est produite lors de la suppression du compte.'], 500);
        }
    }

    public function bloquerCompte($num)
    {
        $compte = Compte::where('num_compte', $num)->first();

        if (!$compte) {
            return response()->json(['message' => 'Compte introuvable'], 404);
        }

        $compte->update(["etat" => 0]);

        return response()->json(['message' => 'Compte bloqué avec succès'], 200);
    }

    public function debloquerCompte($num)
    {
        $compte = Compte::where('num_compte', $num)->first();

        if (!$compte) {
            return response()->json(['message' => 'Compte introuvable'], 404);
        }

        $compte->update(["etat" => 1]);

        return response()->json(['message' => 'Compte débloqué avec succès'], 200);
    }

    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompteRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Compte $compte)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Compte $compte)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompteRequest $request, Compte $compte)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Compte $compte)
    {
        //
    }
}
