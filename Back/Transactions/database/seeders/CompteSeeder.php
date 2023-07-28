<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $comptes = [
            [
                'solde' => 1000,
                'num_compte' => 'om_783845870',
                'fournisseur' => 'om',
                'client_id' => 1,
            ],
            [
                'solde' => 2000,
                'num_compte' => 'wv_709876540',
                'fournisseur' => 'wv',
                'client_id' => 2,
            ],
            [
                'solde' => 2000,
                'num_compte' => 'wv_783845870',
                'fournisseur' => 'wv',
                'client_id' => 1,
            ], 
            [
                'solde' => 2000,
                'num_compte' => 'cb_789006440',
                'fournisseur' => 'cb',
                'client_id' => 3,
            ],
            [
                'solde' => 2000,
                'num_compte' => 'cb_774076120',
                'fournisseur' => 'cb',
                'client_id' => 4,
            ]
        ];

        DB::table('comptes')->insert($comptes);
    }
}
