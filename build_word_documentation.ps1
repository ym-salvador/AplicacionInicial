# ==============================================================================
# SCRIPT DE GENERACION AUTOMATIZADA DE DOCUMENTACION EN MICROSOFT WORD (.DOCX)
# Proyecto: Sistema EdTech de Matematica Inicial (5 Anos) - CNEB Ciclo II
# ==============================================================================

$ErrorActionPreference = "Stop"

function Get-RGBColor([int]$r, [int]$g, [int]$b) {
    return [int]($r + ($g * 256) + ($b * 65536))
}

$cNavy      = Get-RGBColor 30 58 138     # Azul Marino Institucional
$cBlue      = Get-RGBColor 37 99 235     # Azul Primario
$cTeal      = Get-RGBColor 15 118 110    # Verde Azulado
$cEmerald   = Get-RGBColor 5 150 105     # Verde Esmeralda
$cAmber     = Get-RGBColor 217 119 6     # Ambar / Dorado
$cDarkSlate = Get-RGBColor 30 41 59      # Texto Oscuro Principal
$cMuted     = Get-RGBColor 100 116 139   # Texto Secundario
$cLightBg   = Get-RGBColor 239 246 255   # Fondo Azul Muy Claro
$cLightGray = Get-RGBColor 248 250 252   # Fondo Gris Claro Alternante
$cBorder    = Get-RGBColor 203 213 225   # Borde Tablas
$cWhite     = Get-RGBColor 255 255 255   # Blanco

$outputPath = [string](Join-Path $PSScriptRoot "DOCUMENTACION_SISTEMA_EDTECH_CNEB_5_ANOS.docx")

Write-Host "Iniciando Microsoft Word..." -ForegroundColor Cyan
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $word.Documents.Add()

    # Configuracion de Pagina (Margenes de 2.5 cm = 70.87 pt)
    $doc.PageSetup.TopMargin = 70.87
    $doc.PageSetup.BottomMargin = 70.87
    $doc.PageSetup.LeftMargin = 70.87
    $doc.PageSetup.RightMargin = 70.87
    $doc.PageSetup.DifferentFirstPageHeaderFooter = $true

    # Seccion para encabezado y pie
    $section = $doc.Sections.Item(1)
    
    # Encabezado
    $headerRange = $section.Headers.Item(1).Range
    $headerRange.Text = "SISTEMA EDTECH MATEMATICA INICIAL (5 ANOS) - CNEB CICLO II"
    $headerRange.Font.Name = "Calibri"
    $headerRange.Font.Size = 8.5
    $headerRange.Font.Bold = $true
    $headerRange.Font.Color = $cMuted
    $headerRange.ParagraphFormat.Alignment = 2 # Derecha

    # Pie de Pagina
    $footerRange = $section.Footers.Item(1).Range
    $footerRange.Text = "Documento Tecnico y Pedagogico Integral | Marco RVM N 094-2020-MINEDU"
    $footerRange.Font.Name = "Calibri"
    $footerRange.Font.Size = 8.5
    $footerRange.Font.Color = $cMuted
    $footerRange.ParagraphFormat.Alignment = 0 # Izquierda

    # Helper para asegurar un parrafo limpio al final
    function Append-Paragraph {
        $docEnd = $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
        $docEnd.InsertParagraphAfter()
        return $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
    }

    # --- FUNCIONES DE FORMATEO ---
    function Add-CoverPage {
        $pSpace = $doc.Paragraphs.Add()
        $pSpace.Range.Text = "`n`n"
        $pSpace.Range.Font.Size = 14

        $pBadge = $doc.Paragraphs.Add()
        $pBadge.Range.Text = "MINISTERIO DE EDUCACION DEL PERU | CNEB CICLO II | 5 ANOS"
        $pBadge.Range.Font.Name = "Calibri"
        $pBadge.Range.Font.Size = 11
        $pBadge.Range.Font.Bold = $true
        $pBadge.Range.Font.Color = $cBlue
        $pBadge.Range.ParagraphFormat.Alignment = 1
        $pBadge.Range.ParagraphFormat.SpaceAfter = 16

        $pTitle = $doc.Paragraphs.Add()
        $pTitle.Range.Text = "SISTEMA INTEGRAL EDTECH DE MATEMATICA INICIAL"
        $pTitle.Range.Font.Name = "Calibri"
        $pTitle.Range.Font.Size = 26
        $pTitle.Range.Font.Bold = $true
        $pTitle.Range.Font.Color = $cNavy
        $pTitle.Range.ParagraphFormat.Alignment = 1
        $pTitle.Range.ParagraphFormat.SpaceAfter = 10
        $pTitle.Range.ParagraphFormat.LineSpacingRule = 0

        $pSub = $doc.Paragraphs.Add()
        $pSub.Range.Text = "Aventuras Matematicas con Kusi | Gamificacion, Sincronizacion en la Nube y Evaluacion Formativa SIAGIE"
        $pSub.Range.Font.Name = "Calibri"
        $pSub.Range.Font.Size = 13.5
        $pSub.Range.Font.Italic = $true
        $pSub.Range.Font.Color = $cTeal
        $pSub.Range.ParagraphFormat.Alignment = 1
        $pSub.Range.ParagraphFormat.SpaceAfter = 35

        # Cuadro de Metadatos (Tabla 1x1 segura)
        $docEnd = $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
        $docEnd.InsertParagraphAfter()
        $rangeMeta = $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
        $metaTable = $doc.Tables.Add($rangeMeta, 1, 1)
        $metaTable.Rows.Item(1).Range.Shading.BackgroundPatternColor = $cLightBg
        $metaTable.Borders.InsideLineStyle = 0
        $metaTable.Borders.OutsideLineStyle = 1
        $metaTable.Borders.OutsideColor = $cBlue
        $metaTable.Borders.OutsideLineWidth = 18
        
        $cellMeta = $metaTable.Cell(1, 1).Range
        $cellMeta.Text = "FICHA TECNICA DEL SISTEMA EDUCATIVO`n" +
            "- Marco Curricular: Curriculo Nacional de la Educacion Basica (CNEB) - Ciclo II (5 Anos)`n" +
            "- Norma Tecnica Evaluativa: RVM N 094-2020-MINEDU (Escala Cualitativa AD, A, B, C)`n" +
            "- Docente Administradora y Disenadora: Prof. Yanet Salvador`n" +
            "- Institucion Educativa: I.E. Inicial San Gabriel (Configuracion Personalizable)`n" +
            "- Arquitectura: Single Page Application (SPA), Supabase PostgreSQL, LocalStorage Offline-First`n" +
            "- Version del Sistema: 3.0 (Edicion Integral en Tiempo Real)`n" +
            "- Fecha de Emision: Octubre de 2026"
        $cellMeta.Font.Name = "Calibri"
        $cellMeta.Font.Size = 10.5
        $cellMeta.Font.Color = $cDarkSlate
        $cellMeta.ParagraphFormat.SpaceBefore = 8
        $cellMeta.ParagraphFormat.SpaceAfter = 8
        $cellMeta.ParagraphFormat.LineSpacing = 16

        # Salto de pagina
        $docEndPost = $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
        $docEndPost.InsertParagraphAfter()
        $pBreak = $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
        $pBreak.InsertBreak(7)
    }

    function Add-H1([string]$text) {
        $r = Append-Paragraph
        $r.Text = $text
        $r.Font.Name = "Calibri"
        $r.Font.Size = 16
        $r.Font.Bold = $true
        $r.Font.Color = $cNavy
        $r.ParagraphFormat.SpaceBefore = 16
        $r.ParagraphFormat.SpaceAfter = 6
        $r.ParagraphFormat.KeepWithNext = $true
    }

    function Add-H2([string]$text) {
        $r = Append-Paragraph
        $r.Text = $text
        $r.Font.Name = "Calibri"
        $r.Font.Size = 13
        $r.Font.Bold = $true
        $r.Font.Color = $cBlue
        $r.ParagraphFormat.SpaceBefore = 12
        $r.ParagraphFormat.SpaceAfter = 4
        $r.ParagraphFormat.KeepWithNext = $true
    }

    function Add-H3([string]$text) {
        $r = Append-Paragraph
        $r.Text = $text
        $r.Font.Name = "Calibri"
        $r.Font.Size = 11.5
        $r.Font.Bold = $true
        $r.Font.Color = $cTeal
        $r.ParagraphFormat.SpaceBefore = 8
        $r.ParagraphFormat.SpaceAfter = 3
        $r.ParagraphFormat.KeepWithNext = $true
    }

    function Add-P([string]$text) {
        $r = Append-Paragraph
        $r.Text = $text
        $r.Font.Name = "Calibri"
        $r.Font.Size = 10.5
        $r.Font.Color = $cDarkSlate
        $r.ParagraphFormat.SpaceBefore = 0
        $r.ParagraphFormat.SpaceAfter = 5
        $r.ParagraphFormat.LineSpacingRule = 0
    }

    function Add-Bullet([string]$prefix, [string]$text) {
        $r = Append-Paragraph
        $r.Text = "$prefix $text"
        $r.Font.Name = "Calibri"
        $r.Font.Size = 10.5
        $r.Font.Color = $cDarkSlate
        $r.ParagraphFormat.LeftIndent = 18
        $r.ParagraphFormat.SpaceBefore = 1
        $r.ParagraphFormat.SpaceAfter = 3
    }

    function Add-Callout([string]$title, [string]$text, [string]$type = "info") {
        $docEnd = $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
        $docEnd.InsertParagraphAfter()

        $rangeCallout = $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
        $tbl = $doc.Tables.Add($rangeCallout, 1, 1)
        
        $borderCol = $cBlue
        $bgCol = $cLightBg
        if ($type -eq "success") { $borderCol = $cEmerald; $bgCol = Get-RGBColor 240 253 244 }
        if ($type -eq "warn")    { $borderCol = $cAmber;   $bgCol = Get-RGBColor 254 243 199 }

        $tbl.Rows.Item(1).Range.Shading.BackgroundPatternColor = $bgCol
        $tbl.Borders.Enable = $false
        $leftBorder = $tbl.Borders.Item(-1)
        $leftBorder.LineStyle = 1
        $leftBorder.LineWidth = 24
        $leftBorder.Color = $borderCol
        
        $cRange = $tbl.Cell(1, 1).Range
        $cRange.Text = "$title`n$text"
        $cRange.Font.Name = "Calibri"
        $cRange.Font.Size = 10
        $cRange.Font.Color = $cDarkSlate
        $cRange.ParagraphFormat.SpaceBefore = 5
        $cRange.ParagraphFormat.SpaceAfter = 5
        $cRange.ParagraphFormat.LineSpacing = 14

        $docEndPost = $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
        $docEndPost.InsertParagraphAfter()
    }

    function Add-Table([array]$headers, [array]$rows, [array]$widths = $null) {
        $docEnd = $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
        $docEnd.InsertParagraphAfter()

        $rowCount = $rows.Count + 1
        $colCount = $headers.Count
        $rangeTbl = $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
        $tbl = $doc.Tables.Add($rangeTbl, $rowCount, $colCount)
        
        $tbl.Borders.InsideLineStyle = 1
        $tbl.Borders.InsideColor = $cBorder
        $tbl.Borders.OutsideLineStyle = 1
        $tbl.Borders.OutsideColor = $cBlue

        # Encabezado
        for ($c = 0; $c -lt $colCount; $c++) {
            $cell = $tbl.Cell(1, $c + 1).Range
            $cell.Text = $headers[$c]
            $cell.Font.Name = "Calibri"
            $cell.Font.Size = 9.5
            $cell.Font.Bold = $true
            $cell.Font.Color = $cWhite
            $cell.ParagraphFormat.Alignment = 1
            $cell.ParagraphFormat.SpaceBefore = 3
            $cell.ParagraphFormat.SpaceAfter = 3
        }
        $tbl.Rows.Item(1).Range.Shading.BackgroundPatternColor = $cNavy
        $tbl.Rows.Item(1).HeadingFormat = $true

        # Filas de Datos
        for ($r = 0; $r -lt $rows.Count; $r++) {
            $rowObj = $rows[$r]
            $rowNum = $r + 2
            for ($c = 0; $c -lt $colCount; $c++) {
                $cell = $tbl.Cell($rowNum, $c + 1).Range
                $cell.Text = [string]$rowObj[$c]
                $cell.Font.Name = "Calibri"
                $cell.Font.Size = 9
                $cell.Font.Color = $cDarkSlate
                $cell.ParagraphFormat.SpaceBefore = 2
                $cell.ParagraphFormat.SpaceAfter = 2
            }
            if ($r % 2 -eq 1) {
                $tbl.Rows.Item($rowNum).Range.Shading.BackgroundPatternColor = $cLightGray
            } else {
                $tbl.Rows.Item($rowNum).Range.Shading.BackgroundPatternColor = $cWhite
            }
        }

        # Ajuste de Anchos de Columna si se especifican
        if ($widths -and $widths.Count -eq $colCount) {
            for ($c = 0; $c -lt $colCount; $c++) {
                $tbl.Columns.Item($c + 1).Width = $widths[$c]
            }
        }

        $docEndPost = $doc.Range($doc.Content.End - 1, $doc.Content.End - 1)
        $docEndPost.InsertParagraphAfter()
    }

    # ==============================================================================
    # CONTENIDO FORMAL DEL DOCUMENTO
    # ==============================================================================
    Write-Host "Generando portada..." -ForegroundColor Yellow
    Add-CoverPage

    # INDICE GENERAL
    Write-Host "Generando Tabla de Contenidos..." -ForegroundColor Yellow
    Add-H1 "Indice General del Documento"
    Add-Bullet "1." "Introduccion y Enfoque Pedagogico del CNEB (Ciclo II)"
    Add-Bullet "2." "Experiencia de Usuario Infantil (UX/UI para Prelectores)"
    Add-Bullet "3." "Malla Curricular Integral: 2 Mundos, 6 Sesiones y 23 Retos"
    Add-Bullet "4." "Evaluacion Formativa y Motor de Conclusiones para SIAGIE"
    Add-Bullet "5." "Sincronizacion en la Nube con Supabase y Modo Offline"
    Add-Bullet "6." "Modulo de Autenticacion, Roles y Auto-Login (auth.js)"
    Add-Bullet "7." "Panel Docente de Gestion Integral (docente.js)"
    Add-Bullet "8." "Portal para Familias y Emision de Diplomas Oficiales"
    Add-Bullet "9." "Guia de Instalacion y Despliegue en Servidor o GitHub Pages"
    Add-Bullet "10." "Especificaciones Tecnicas y Requisitos de Sistema"

    # 1. INTRODUCCION Y ENFOQUE PEDAGOGICO
    Write-Host "Generando Seccion 1: Enfoque Pedagogico..." -ForegroundColor Yellow
    Add-H1 "1. Introduccion y Enfoque Pedagogico del CNEB (Ciclo II)"
    Add-P "El presente documento constituye el manual tecnico, curricular y de operaciones del Sistema EdTech de Matematica Inicial para ninos y ninas de 5 anos. La solucion ha sido desarrollada bajo la alineacion estricta al Curriculo Nacional de la Educacion Basica (CNEB) del Ministerio de Educacion del Peru (MINEDU) y su marco evaluativo normado por la Resolucion Viceministerial N 094-2020-MINEDU."
    Add-P "El software articula las dos competencias fundamentales del area de Matematica en el Ciclo II:"
    Add-Bullet "1." "Competencia 1: Resuelve problemas de cantidad."
    Add-Bullet "2." "Competencia 2: Resuelve problemas de forma, movimiento y localizacion."

    Add-H2 "1.1 Principios Pedagogicos Fundamentales"
    Add-Bullet "-" "Pedagogia del Error Constructivo: Se elimina el concepto de fracaso o castigo visual/auditivo. No existen sonidos agresivos ni pantallas de 'Perdiste'. Cuando el nino ensaya una alternativa no acertada, la mascota Kusi realiza un gesto reflexivo y proporciona una pista oral y visual (scaffolding). Al segundo intento, la opcion correcta se resalta mediante un pulso sutil."
    Add-Bullet "-" "Transicion Concreto - Grafico - Simbolico: Respeta los estadios del desarrollo piagetiano en la etapa preoperacional. Los ninos manipulan objetos digitales familiares (frutas, canastas, animales, flores, balanzas) afianzando la nocion matematica previa a cualquier simbolismo abstracto."
    Add-Bullet "-" "Evaluacion Formativa Cualitativa: Clasificacion sistematica bajo la escala oficial: AD (Logro Destacado), A (Logro Esperado), B (En Proceso) y C (En Inicio), computando nivel de autonomia, pistas requeridas e intentos realizados."

    Add-Callout "FUNDAMENTO NORMATIVO CNEB" "Segun la RVM N 094-2020-MINEDU, en el Ciclo II la evaluacion es netamente formativa. Busca valorar el desempeno del estudiante, identificar sus avances y dificultades, y brindar mediacion oportuna en un clima de seguridad y afecto." "info"

    # 2. EXPERIENCIA DE USUARIO PRELECTORA
    Write-Host "Generando Seccion 2: Experiencia de Usuario..." -ForegroundColor Yellow
    Add-H1 "2. Experiencia de Usuario Infantil (UX/UI para Prelectores)"
    Add-P "Disenada especificamente para ninos de 5 anos en etapa prelectora, garantizando total autonomia:"
    Add-Bullet "-" "Sintesis de Voz Guiada (Web Speech API): Cada reto, instruccion y refuerzo positivo es narrado en espanol con tono infantil, calido y pausado. Incluye un boton parlante autonomo junto a la mascota que permite repetir la instruccion a voluntad."
    Add-Bullet "-" "Arrastre y Soltado Fisico Real (Physics Drag and Drop Engine): Motor desarrollado con la Pointer Events API que soporta pantallas tactiles, tablets y raton. El nino arrastra con su dedo los objetos hacia las canastas, cajas o siluetas para estimular su coordinacion visomotriz y psicomotricidad fina."
    Add-Bullet "-" "Bisel Chunky 3D y Elementos Gigantes: Zonas de toque superiores a 64x64px (hasta 110px) con relieve tridimensional que brindan retroalimentacion visual al contacto."
    Add-Bullet "-" "Sintetizador Sonoro Procedural (Web Audio API): Efectos de sonido y notas musicales generados con osciladores matematicos senoidales. No requiere descargar archivos externos y funciona 100% offline."
    Add-Bullet "-" "Celebracion Festiva: Animacion nativa en Canvas HTML5 con confeti multicolor y lluvia de estrellas al superar exitosamente cada desafio."

    # 3. MALLA CURRICULAR Y MATRIZ DE RETOS
    Write-Host "Generando Seccion 3: Malla Curricular..." -ForegroundColor Yellow
    Add-H1 "3. Malla Curricular Integral: 2 Mundos, 6 Sesiones y 23 Retos"
    Add-P "La estructura curricular completa comprende 23 minijuegos interactivos gamificados distribuidos en 6 sesiones pedagogicas:"

    $headersMalla = @("Mundo / Sesion", "Reto Interactivo", "Desempeno Oficial CNEB", "Mecanica de Aprendizaje")
    $rowsMalla = @(
        @("Mundo 1: Cantidad`nSesion 1: Bodeguita", "1.1 Agrupar por Color", "Agrupa objetos segun caracteristicas perceptuales.", "Arrastre de 6 frutas a canastas roja, amarilla y verde."),
        @("Mundo 1: Cantidad`nSesion 1: Bodeguita", "1.2 Agrupar por Tamano", "Compara y agrupa objetos grandes y pequenos.", "Clasificacion de frutas en caja grande y caja pequena."),
        @("Mundo 1: Cantidad`nSesion 1: Bodeguita", "1.3 Cuantificadores", "Usa expresiones: muchos, pocos, ninguno.", "Discriminacion perceptual de la canasta vacia (ninguno)."),
        @("Mundo 1: Cantidad`nSesion 1: Bodeguita", "1.4 Comparar Colecciones", "Utiliza expresiones: mas que, menos que.", "Comparacion de platos con frutas (donde hay mas que)."),
        @("Mundo 1: Cantidad`nSesion 2: El Huerto", "2.1 Seriar 5 Plantitas", "Seria por tamano hasta con 5 objetos (orden creciente).", "Ordenamiento de 5 plantitas desde semilla hasta arbol."),
        @("Mundo 1: Cantidad`nSesion 2: El Huerto", "2.2 Seriar Zanahorias", "Seria por longitud desde la mas corta a mas larga.", "Disposicion de 5 zanahorias para el conejito."),
        @("Mundo 1: Cantidad`nSesion 2: El Huerto", "2.3 Trencito Ordinales", "Identifica numeros ordinales del 1. al 5. lugar.", "Reconocimiento del animalito en el vagon indicado."),
        @("Mundo 1: Cantidad`nSesion 2: El Huerto", "2.4 Primero y Ultimo", "Identifica posiciones relativas en una fila.", "Reconoce quien esta primero y quien ultimo en la fila."),
        @("Mundo 1: Cantidad`nSesion 3: El Mercado", "3.1 Conteo hasta 10", "Conteo biunivoco termino a termino hasta 10.", "Llenado con sonido del Marco de Diez con naranjas."),
        @("Mundo 1: Cantidad`nSesion 3: El Mercado", "3.2 Agregar hasta 5", "Resuelve situaciones aditivas concretas hasta 5.", "Patitos que se suman nadando en la laguna."),
        @("Mundo 1: Cantidad`nSesion 3: El Mercado", "3.3 Quitar hasta 5", "Resuelve situaciones sustractivas concretas hasta 5.", "Monito que come galletas del plato en el picnic."),
        @("Mundo 1: Cantidad`nSesion 3: El Mercado", "3.4 Balanza Magica", "Compara pesos: pesa mas, pesa menos.", "Brazo basculante interactivo que se inclina con el peso."),
        @("Mundo 1: Cantidad`nSesion 3: El Mercado", "3.5 Antes y Despues", "Utiliza nociones temporales cotidianas.", "Secuencia temporal de habitos diarios (despertar, aseo)."),
        @("Mundo 2: Espacio`nSesion 1: Formas 2D/3D", "1.1 Museo Formas 2D", "Relaciona formas de su entorno con figuras 2D.", "Identifica circulo, cuadrado, triangulo y rectangulo."),
        @("Mundo 2: Espacio`nSesion 1: Formas 2D/3D", "1.2 Cuerpos 3D Reales", "Identifica cuerpos 3D cotidianos en su entorno.", "Asocia lata con cilindro, dado con cubo, pelota con esfera."),
        @("Mundo 2: Espacio`nSesion 1: Formas 2D/3D", "1.3 Rueda o No Rueda", "Diferencia cuerpos redondos de figuras planas.", "Clasificacion dinamica de objetos rodantes frente a planos."),
        @("Mundo 2: Espacio`nSesion 2: El Parque", "2.1 Cerca y Lejos", "Ubica objetos usando cerca de y lejos de.", "Arrastre de la pelota cerca o lejos del arbol."),
        @("Mundo 2: Espacio`nSesion 2: El Parque", "2.2 Al Lado de", "Ubica personajes con la expresion al lado de.", "Sienta al osito de peluche al lado del tobogan."),
        @("Mundo 2: Espacio`nSesion 2: El Parque", "2.3 El Parque de Kusi", "Organiza movimientos y posiciones en el espacio.", "Ubica el barquito cerca de la orilla de la laguna."),
        @("Mundo 2: Espacio`nSesion 3: Desplazamiento", "3.1 Laberinto de Fido", "Desplazamiento en cuadricula con flechas tactiles.", "Guia al perrito adelante, atras, hacia los lados."),
        @("Mundo 2: Espacio`nSesion 3: Desplazamiento", "3.2 Camino Mas Largo", "Establece relaciones de medida: mas largo que.", "Comparacion perceptual de senderos de baldosas y flores."),
        @("Mundo 2: Espacio`nSesion 3: Desplazamiento", "3.3 Cintas Mas Cortas", "Establece relaciones de medida: mas corto que.", "Identificacion de la cinta festiva mas corta."),
        @("Mundo 2: Espacio`nSesion 3: Desplazamiento", "3.4 Puente de Madera", "Resuelve problemas practicos de longitud.", "Seleccion de la tabla mas larga para que Kusi cruce el rio.")
    )
    Add-Table $headersMalla $rowsMalla @(105, 95, 135, 135)

    # 4. EVALUACION FORMATIVA Y SIAGIE
    Write-Host "Generando Seccion 4: Evaluacion y SIAGIE..." -ForegroundColor Yellow
    Add-H1 "4. Evaluacion Formativa y Motor de Conclusiones para SIAGIE"
    Add-P "El motor de evaluacion implementado en js/state.js evalua cada juego bajo la escala cualitativa oficial del Ciclo II (RVM N 094-2020-MINEDU):"

    $headersEscala = @("Calificacion", "Denominacion Oficial", "Criterio de Evaluacion Automatizado", "Mediacion del Sistema")
    $rowsEscala = @(
        @("AD", "Logro Destacado", "Resuelve el reto en su primer intento con total autonomia y sin requerir pistas.", "Refuerzo verbal positivo y 3 estrellas ganadas."),
        @("A", "Logro Esperado", "Resuelve satisfactoriamente en 1 o 2 intentos de manera autonoma.", "Felicitacion afectiva y 2 a 3 estrellas."),
        @("B", "En Proceso", "Resuelve la actividad tras reflexionar con las pistas amigables de Kusi.", "Pista auditiva adaptada y mediacion de la mascota."),
        @("C", "En Inicio", "Presenta dificultades reiteradas o requiere acompanamiento directo del adulto.", "Resaltado pulsante de la opcion correcta y apoyo.")
    )
    Add-Table $headersEscala $rowsEscala @(65, 95, 170, 140)

    Add-H2 "4.1 Redaccion Automatizada de Conclusiones Descriptivas"
    Add-P "El sistema redacta automaticamente las conclusiones descriptivas requeridas para las libretas y el sistema SIAGIE del MINEDU, tanto para la Competencia de Cantidad como para la de Espacio, describiendo logros observados y sugerencias formativas concretas para los padres."

    # 5. SINCRONIZACION EN LA NUBE CON SUPABASE
    Write-Host "Generando Seccion 5: Supabase y Cloud..." -ForegroundColor Yellow
    Add-H1 "5. Sincronizacion en la Nube con Supabase y Modo Offline"
    Add-P "El sistema implementa una arquitectura hibrida Offline-First:"
    Add-Bullet "-" "Funcionamiento Offline: Si no hay conexion a internet, todo se almacena y opera de forma instantanea en localStorage sin perder avances."
    Add-Bullet "-" "Sincronizacion en Tiempo Real (Supabase): Al conectarse a internet, la aplicacion sincroniza las estrellas, retos completados y notas cualitativas con la base de datos PostgreSQL alojada en Supabase mediante el cliente oficial v2."
    Add-Bullet "-" "Seguridad RLS: Las tablas disponen de politicas Row Level Security que garantizan el consumo seguro mediante la anon key."

    $headersDB = @("Tabla", "Campos Principales", "Tipo / Restricciones", "Proposito en el Sistema")
    $rowsDB = @(
        @("colegio_config", "id, school_name, active_class, teacher_name, mascot_icon, teacher_pin, institution_logo, director_name, teacher_signature, certificate_city", "TEXT, UUID PK ('aula_default')", "Configuracion de la I.E., logos, firmas digitales y parametros del diploma."),
        @("usuarios", "id, nombre, email, telefono, rol, pin_acceso, ultimo_ingreso", "UUID PK, rol IN ('docente', 'padre')", "Cuentas de usuario para docentes y familias."),
        @("estudiantes", "id, parent_id, nombre, avatar, estrellas, pin_acceso, ultimo_acceso", "TEXT PK (Codigo [Letra]+4 digitos)", "Nomina oficial de estudiantes con estrellas y avatar animal."),
        @("evaluaciones", "id, estudiante_id, juego_id, intentos, aciertos, pistas, completado, calificacion", "UUID PK, FK estudiante_id, UNIQUE", "Registro formativo individual de los 23 retos con calificacion CNEB.")
    )
    Add-Table $headersDB $rowsDB @(85, 125, 110, 150)

    # 6. AUTENTICACION Y ROLES
    Write-Host "Generando Seccion 6: Autenticacion..." -ForegroundColor Yellow
    Add-H1 "6. Modulo de Autenticacion, Roles y Auto-Login (auth.js)"
    Add-P "Proteccion integral y facilidad de uso adaptada al contexto escolar:"
    Add-Bullet "-" "Rol Docente: Acceso mediante PIN maestro de seguridad (por defecto 1234)."
    Add-Bullet "-" "Rol Familias y Ninos: Acceso mediante Codigo de Estudiante (ej. V4821) y PIN personal."
    Add-Bullet "-" "Auto-Login Inteligente por URL: Enlace directo con parametros (index.html?id=V4821&pin=V4821) para que los ninos ingresen desde el WhatsApp de sus padres con un solo toque y sean saludados por voz."
    Add-Bullet "-" "Modo Suplantacion (Admin Impersonation): Permite a la docente ingresar al entorno de cualquier alumno desde su panel con un clic sin requerir la clave del apoderado."

    $headersMatriz = @("Modulo / Accion", "Docente Administradora", "Familias / Estudiantes")
    $rowsMatriz = @(
        @("Jugar Retos Gamificados", "Acceso Total", "Acceso a su Perfil Propio"),
        @("Ver Sabana de Notas Grupal", "Permitido (Panel Exclusivo)", "Denegado (Privacidad Escolar)"),
        @("Consultar Ficha SIAGIE", "Todos los Alumnos", "Solo su Hijo/a"),
        @("Configurar Mascota y Colegio", "Permitido (PIN Protegido)", "Denegado"),
        @("Emitir Diplomas de Logro", "Configuracion y Firma", "Descarga e Impresion")
    )
    Add-Table $headersMatriz $rowsMatriz @(150, 160, 160)

    # 7. PANEL DOCENTE
    Write-Host "Generando Seccion 7: Panel Docente..." -ForegroundColor Yellow
    Add-H1 "7. Panel Docente de Gestion Integral (docente.js)"
    Add-P "El panel docente ofrece cuatro modulos de trabajo esenciales:"
    Add-Bullet "1." "Monitoreo del Aula: Sabana grupal con KPIs en tiempo real (alumnos totales, completados, en proceso y pendientes), Podio de Honor de los 3 mejores alumnos, semaforo de avance, exportacion completa a Excel (CSV) y sincronizacion de reportes recibidos."
    Add-Bullet "2." "Ficha Individual CNEB: Informe formal por estudiante con membrete institucional, notas oficiales AD/A/B/C y conclusiones descriptivas para SIAGIE listas para imprimir en PDF."
    Add-Bullet "3." "Familias y Accesos: Registro de nuevos alumnos, generacion automatica de accesos y envio directo por WhatsApp o Correo Electronico con plantillas preformateadas."
    Add-Bullet "4." "Colegio, Mascota y Diplomas: Catalogo de mas de 30 mascotas (fauna andina y peruana), datos del colegio y carga de logotipo institucional y firmas digitales de direccion y docente para los diplomas."

    # 8. PORTAL PARA FAMILIAS Y DIPLOMAS
    Write-Host "Generando Seccion 8: Portal Familiar..." -ForegroundColor Yellow
    Add-H1 "8. Portal para Familias y Emision de Diplomas Oficiales"
    Add-P "El portal familiar ofrece:"
    Add-Bullet "-" "Privacidad Estricta: Cada familia consulta exclusivamente el progreso de su propio hijo/a."
    Add-Bullet "-" "Boton Enviar a la Profe por WhatsApp: Genera el mensaje con el avance y estrellas y lo envia al numero de la docente con un solo clic."
    Add-Bullet "-" "Medallero Infantil: 6 medallas gamificadas de las sesiones CNEB."
    Add-Bullet "-" "Pautas para el Hogar: 3 recomendaciones practicas de 5 minutos para estimular la matematica cotidiana en casa."
    Add-Bullet "-" "Diploma Oficial de Logro: Desbloqueable al completar los 23 retos pedagogicos, con orla dorada, avatar, estrellas, firmas digitales y membrete del colegio."

    # 9. GUIA DE DESPLIEGUE
    Write-Host "Generando Seccion 9: Guia de Despliegue..." -ForegroundColor Yellow
    Add-H1 "9. Guia de Instalacion y Despliegue en Servidor o GitHub Pages"
    Add-Bullet "1." "Ejecucion Local: Abrir directamente index.html en cualquier navegador moderno sin necesidad de servidores."
    Add-Bullet "2." "Publicacion en GitHub Pages: Subir a un repositorio en GitHub y habilitar Pages en la rama main para acceso publico en la nube."
    Add-Bullet "3." "Vinculacion con Supabase: Ejecutar supabase_schema.sql en el SQL Editor de Supabase y registrar las credenciales en la Zona Docente de la aplicacion."

    # 10. ESPECIFICACIONES TECNICAS
    Write-Host "Generando Seccion 10: Especificaciones Tecnicas..." -ForegroundColor Yellow
    Add-H1 "10. Especificaciones Tecnicas y Requisitos de Sistema"
    $headersTech = @("Componente", "Tecnologia / Version", "Rol en la Solucion")
    $rowsTech = @(
        @("Lenguaje Principal", "Vanilla JavaScript (ES6+)", "Logica modular, despacho de minijuegos y enrutamiento SPA."),
        @("Diseno y Estilos", "TailwindCSS CDN + CSS3 Nativo", "Diseno responsivo, paleta infantil armonica y botones 3D."),
        @("Motor de Audio", "Web Audio API", "Sintesis procedural senoidal de efectos sonoros (100% offline)."),
        @("Motor de Voz", "Web Speech API (SpeechSynthesis)", "Locucion amigable en espanol para la etapa prelectora."),
        @("Motor de Arrastre", "Pointer Events API", "Fisica de Drag and Drop compatible con tactil y raton."),
        @("Base de Datos Cloud", "Supabase v2 (PostgreSQL + RLS)", "Persistencia remota en tiempo real y sincronizacion."),
        @("Persistencia Local", "HTML5 LocalStorage API", "Fallback offline transparente para juego sin internet."),
        @("Motor de Animacion", "HTML5 Canvas API", "Renderizado de confeti fisico y estrellas festivas.")
    )
    Add-Table $headersTech $rowsTech @(130, 160, 180)

    Write-Host "Guardando documento Word en: $outputPath" -ForegroundColor Yellow
    $doc.SaveAs2($outputPath)
    $doc.Close()
    Write-Host "DOCUMENTO WORD GENERADO EXITOSAMENTE!" -ForegroundColor Green

} catch {
    Write-Error "Error en linea $($_.InvocationInfo.ScriptLineNumber): $($_.Exception.Message)"
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
