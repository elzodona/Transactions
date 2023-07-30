<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;
use App\Models\Compte;
use App\Models\Client;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function depot(Request $request)
    {
        $request->validate([
            'destinataire' => 'required',
            'expediteur' => 'required',
            'fournisseur' => 'required',
            'montant' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {

            $code = ($request->fournisseur === 'wr') ? str_pad(mt_rand(1, 999999999999999), 15, '0', STR_PAD_LEFT) : 'DEP' . time();

            $montant_min = ($request->fournisseur === 'wr') ? 1000 : (($request->fournisseur === 'cb') ? 10000 : 500);
            if ($request->montant < $montant_min) {
                return response()->json(['error' => 'Le montant minimum de dépôt est de ' . $montant_min . ' pour le fournisseur ' . $request->fournisseur . '.'], 422);
            }

            $beneficiaire_compte = ($request->fournisseur !== 'wr') ? Compte::where('num_compte', $request->fournisseur . '_' . $request->expediteur)->lockForUpdate()->first() : null;

            // if ($beneficiaire_compte && $beneficiaire_compte->solde < $request->montant) {
            //     return response()->json(['error' => 'Le solde du compte bénéficiaire est insuffisant pour effectuer le dépôt.'], 422);
            // }

            if ($request->fournisseur === 'wr' && !$beneficiaire_compte) {
                $expediteur = Client::where('telephone', $request->expediteur)->first();
                if (!$expediteur) {
                    return response()->json(['error' => 'Le bénéficiaire doit être un client enregistré pour effectuer le dépôt avec Wari.'], 422);
                }
            } else {
                $expediteur = null;
            }

            if ($beneficiaire_compte) {
                $beneficiaire_compte->increment('solde', $request->montant);
            }

            $expediteur = Client::where('telephone', $request->expediteur)->first();

            $transaction = Transaction::create([
                'montant' => $request->montant,
                'type_trans' => 'depot',
                'code' => $code,
                'client_id' => $expediteur ? $expediteur : null,
                'destination_compte_id' => $beneficiaire_compte ? $beneficiaire_compte->id : null,
                'client_id' => ($request->fournisseur === 'wr') ? ($expediteur ? $expediteur->id : null) : ($request->expediteur ? Client::where('telephone', $request->expediteur)->value('id') : null),
                'date_transaction' => now()
            ]);

            DB::commit();

            return response()->json(['message' => 'Dépôt effectué avec succès', 'transaction' => $transaction]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Une erreur s\'est produite lors du dépôt. Veuillez réessayer.', 'details' => $e->getMessage()], 500);
        }
    }

    public function retrait(Request $request)
    {
        $request->validate([
            'expediteur' => 'required',
            'fournisseur' => 'required',
            'montant' => 'required|numeric|min:0',
        ]);

        $beneficiaire_compte = Compte::where('num_compte', $request->fournisseur . '_' . $request->expediteur)->first();

        if (!$beneficiaire_compte) {
            return response()->json(['error' => 'Le bénéficiaire doit avoir un compte pour effectuer le retrait.'], 422);
        }

        if ($beneficiaire_compte->solde < $request->montant) {
            return response()->json(['error' => 'Le solde du compte bénéficiaire est insuffisant pour effectuer le retrait.'], 422);
        }

        $beneficiaire_compte->decrement('solde', $request->montant);

        $transaction = Transaction::create([
            'montant' => $request->montant,
            'type_trans' => 'retrait',
            'code' => 'RETRAIT' . time(),
            'expediteur_compte_id' => $beneficiaire_compte->id,
            'date_transaction' => now()
        ]);

        return response()->json(['message' => 'Retrait effectué avec succès', 'transaction' => $transaction]);
    }

    public function transfert(Request $request)
    {
        $request->validate([
            'expediteur' => 'required',
            'expediteur' => 'required',
            'fournisseur' => 'required',
            'montant' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {

            if ($request->expediteur && $request->expediteur) {
                $expediteur_compte = Compte::where('num_compte', $request->fournisseur . '_' . $request->expediteur)->lockForUpdate()->first();
                $expediteur_compte = Compte::where('num_compte', $request->fournisseur . '_' . $request->expediteur)->lockForUpdate()->first();

                if (!$expediteur_compte || !$expediteur_compte) {
                    return response()->json(['error' => 'Les comptes de l\'expéditeur et du expediteur doivent appartenir au même fournisseur et être enregistrés pour effectuer le transfert.'], 422);
                }

                $frais = $request->montant * (($request->fournisseur === 'cb') ? 0.05 : (($request->fournisseur === 'wr') ? 0.02 : 0.01));
                $montantTotal = $request->montant + $frais;

                if ($expediteur_compte->solde < $montantTotal) {
                    return response()->json(['error' => 'Le solde du compte expéditeur est insuffisant pour effectuer le transfert.'], 422);
                }

                $montantMinimum = ($request->fournisseur === 'cb') ? 10000 : (($request->fournisseur === 'wr') ? 1000 : 500);
                $montantMaximum = ($request->fournisseur === 'cb') ? 1000000 : 100000;

                if ($request->montant < $montantMinimum || $request->montant > $montantMaximum) {
                    return response()->json(['error' => 'Le montant du transfert ne respecte pas les limites autorisées.'], 422);
                }

                if ($request->fournisseur === 'om') {
                   
                } elseif ($request->fournisseur === 'cb') {
                
                }

                $expediteur_compte->decrement('solde', $montantTotal);
                $expediteur_compte->increment('solde', $request->montant);

                $transaction = Transaction::create([
                    'montant' => $request->montant,
                    'type_trans' => 'CbyC',
                    'code' => 'TRANSFERT' . time(),
                    'frais' => $frais,
                    'expediteur_compte_id' => $expediteur_compte->id,
                    'destination_compte_id' => $expediteur_compte->id,
                    'date_transaction' => now()
                ]);

                DB::commit();

                return response()->json(['message' => 'Transfert effectué avec succès', 'transaction' => $transaction]);
            } else {
                return response()->json(['error' => 'L\'expéditeur et le expediteur doivent être spécifiés pour effectuer le transfert.'], 422);
            }
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Une erreur s\'est produite lors du transfert. Veuillez réessayer.', 'details' => $e->getMessage()], 500);
        }
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
    public function store(StoreTransactionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
