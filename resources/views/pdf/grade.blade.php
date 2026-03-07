<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Grade Horária - {{ $grade->nome }}</title>
    <style>
        @page { margin: 1cm; }
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            color: #2d3748; 
            margin: 0; 
            padding: 0;
            line-height: 1.4;
        }
        .page-break { page-break-after: always; }
        
        /* Cabeçalho Premium */
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            padding-bottom: 15px;
            border-bottom: 3px solid #f6ad55;
        }
        .header h1 { 
            margin: 0; 
            font-size: 24px; 
            color: #dd6b20; 
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .header h2 { 
            margin: 5px 0; 
            font-size: 18px; 
            color: #4a5568; 
            font-weight: 400;
        }
        .header .meta {
            font-size: 10px;
            color: #a0aec0;
            margin-top: 5px;
            text-transform: uppercase;
        }

        /* Tabela Estilizada */
        table { 
            width: 100%; 
            border-collapse: separate; 
            border-spacing: 0;
            table-layout: fixed; 
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
        }
        th { 
            background-color: #fffaf0; 
            color: #9c4221; 
            text-transform: uppercase; 
            font-size: 11px; 
            font-weight: bold;
            padding: 15px 10px;
            border-bottom: 2px solid #feebc8;
        }
        td { 
            border: 1px solid #edf2f7; 
            padding: 12px 8px; 
            text-align: center; 
            vertical-align: top;
            background-color: #ffffff;
        }
        .slot-time { 
            background-color: #f7fafc; 
            width: 100px; 
            color: #718096; 
            font-weight: bold;
            font-size: 11px;
            vertical-align: middle;
        }

        /* Cards dentro da Grade */
        .aula-card { 
            text-align: left; 
            padding: 5px;
            border-radius: 6px;
        }
        .uc-nome { 
            font-weight: 800; 
            color: #1a202c; 
            font-size: 10px; 
            margin-bottom: 3px;
            display: block;
        }
        .prof-nome { 
            color: #718096; 
            font-size: 9px; 
            display: block;
            margin-bottom: 4px;
        }
        .sala-tag { 
            display: inline-block;
            background-color: #feebc8;
            color: #9c4221;
            font-size: 8px; 
            font-weight: bold; 
            padding: 2px 6px;
            border-radius: 4px;
            text-transform: uppercase;
        }

        /* Atividades Digitais */
        .digital-container {
            margin-top: 30px;
            padding: 20px;
            background-color: #faf5ff;
            border: 1px solid #e9d8fd;
            border-radius: 15px;
        }
        .digital-title { 
            color: #6b46c1; 
            text-transform: uppercase; 
            font-size: 12px; 
            font-weight: 800;
            margin-bottom: 15px;
            display: block;
            border-left: 4px solid #9f7aea;
            padding-left: 10px;
        }
        .digital-item {
            display: inline-block;
            width: 30%;
            margin-right: 2%;
            margin-bottom: 10px;
            vertical-align: top;
        }
        .digital-uc { font-weight: bold; font-size: 10px; color: #44337a; }
        .digital-prof { font-size: 9px; color: #805ad5; }

    </style>
</head>
<body>
    @foreach($turmas as $turma)
        <div class="header">
            <div class="meta">Sistema de Ensalamento • MySchedU</div>
            <h1>{{ $grade->nome }}</h1>
            <h2>Turma: {{ $turma->nome }}</h2>
            <div class="meta">Emissão: {{ date('d/m/Y H:i') }}</div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 100px;">Horário</th>
                    @foreach($dias as $label) 
                        <th>{{ $label }}</th> 
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach($slots as $slotKey => $slotLabel)
                    <tr>
                        <td class="slot-time">{{ $slotLabel }}</td>
                        @foreach($dias as $diaKey => $diaLabel)
                            <td>
                                @php
                                    $aula = $grade->ensalamentos
                                        ->where('turma_id', $turma->id)
                                        ->where('dia_semana', $diaKey)
                                        ->where('horario_slot', $slotKey)
                                        ->where('is_digital', false)
                                        ->first();
                                @endphp
                                
                                @if($aula)
                                    <div class="aula-card">
                                        <span class="uc-nome">{{ $aula->unidadeCurricular->nome }}</span>
                                        <span class="prof-nome">{{ $aula->professor->nome }}</span>
                                        <span class="sala-tag">Sala: {{ $aula->sala->nome ?? 'S/S' }}</span>
                                    </div>
                                @endif
                            </td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
        </table>

        @php
            $digitais = $grade->ensalamentos->where('turma_id', $turma->id)->where('is_digital', true);
        @endphp

        @if($digitais->count() > 0)
            <div class="digital-container">
                <span class="digital-title">Disciplinas Digitais (EAD)</span>
                @foreach($digitais as $digital)
                    <div class="digital-item">
                        <div class="digital-uc">{{ $digital->unidadeCurricular->nome }}</div>
                        <div class="digital-prof">Prof. {{ $digital->professor->nome }}</div>
                    </div>
                @endforeach
            </div>
        @endif

        @if(!$loop->last)
            <div class="page-break"></div>
        @endif
    @endforeach
</body>
</html>