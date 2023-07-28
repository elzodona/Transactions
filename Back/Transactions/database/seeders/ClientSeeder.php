<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = [
            [
                'nom' => 'Ndao',
                'prenom' => 'Elzo',
                'telephone' => '783845870',
            ],
            [
                'nom' => 'Ndiaye',
                'prenom' => 'Ratma',
                'telephone' => '709876540',
            ],
            [
                'nom' => 'Sy',
                'prenom' => 'Babs',
                'telephone' => '789006440',
            ], [
                'nom' => 'Faye',
                'prenom' => 'Sadio',
                'telephone' => '774076120',
            ]
        ];

        DB::table('clients')->insert($clients);
    
    }
}
