export default {
    // Root
    noRowsLabel: 'Sem Conteúdo',
    noResultsOverlayLabel: 'Nenhum resultado encontrado.',
    errorOverlayDefaultLabel: 'Ocorreu um erro.',

    // Density selector toolbar button text
    toolbarDensity: 'Densidade',
    toolbarDensityLabel: 'Densidade',
    toolbarDensityCompact: 'Compacto',
    toolbarDensityStandard: 'Padrão',
    toolbarDensityComfortable: 'Confortavel',

    // Columns selector toolbar button text
    toolbarColumns: 'Colunas',
    toolbarColumnsLabel: 'Selecionar Colunas',

    // Filters toolbar button text
    toolbarFilters: 'Filtros',
    toolbarFiltersLabel: 'Mostrar Filtros',
    toolbarFiltersTooltipHide: 'Esconder Filtros',
    toolbarFiltersTooltipShow: 'Mostrar Filtros',
    toolbarFiltersTooltipActive: (count) =>
        count !== 1 ? `${count} Filtros Ativos` : `${count} Filtro Ativo`,

    // Export selector toolbar button text
    toolbarExport: 'Export',
    toolbarExportLabel: 'Export',
    toolbarExportCSV: 'Download as CSV',
    toolbarExportPrint: 'Print',

    // Columns panel text
    columnsPanelTextFieldLabel: 'Localizar coluna',
    columnsPanelTextFieldPlaceholder: 'título da coluna',
    columnsPanelDragIconLabel: 'Reordenar coluna',
    columnsPanelShowAllButton: 'Mostrar tudo',
    columnsPanelHideAllButton: 'Ocultar tudo',

    // Filter panel text
    filterPanelAddFilter: 'Add Filtro',
    filterPanelDeleteIconLabel: 'Delete',
    filterPanelOperators: 'Operação',
    filterPanelOperatorAnd: 'e',
    filterPanelOperatorOr: 'ou',
    filterPanelColumns: 'Colunas',
    filterPanelInputLabel: 'Valor',
    filterPanelInputPlaceholder: 'Valor Filtrado',

    // Filter operators text
    filterOperatorContains: 'Contém',
    filterOperatorEquals: 'Igual',
    filterOperatorStartsWith: 'starts with',
    filterOperatorEndsWith: 'ends with',
    filterOperatorIs: 'é',
    filterOperatorNot: 'não é',
    filterOperatorAfter: 'é depois',
    filterOperatorOnOrAfter: 'está ligado ou depois',
    filterOperatorBefore: 'é antes',
    filterOperatorOnOrBefore: 'está ligado ou antes',
    filterOperatorIsEmpty: 'está vazio',
    filterOperatorIsNotEmpty: 'não está vazio',

    // Filter values text
    filterValueAny: 'Qualquer',
    filterValueTrue: 'Verdadeiro',
    filterValueFalse: 'Falso',

    // Column menu text
    columnMenuLabel: 'Menu',
    columnMenuShowColumns: 'Mostrar Colunas',
    columnMenuFilter: 'Filtro',
    columnMenuHideColumn: 'Esconder',
    columnMenuUnsort: 'Desclassificar',
    columnMenuSortAsc: 'Classificar por Crescente',
    columnMenuSortDesc: 'Classificar por Decrescente    ',

    // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
  count !== 1 ? `${count} Filtros Ativos` : `${count} Filtro ativo`,
  columnHeaderFiltersLabel: 'Mostrar filtros',
  columnHeaderSortIconLabel: 'Classificar',

// Rows selected footer text
footerRowSelected: (count) =>
  count !== 1
    ? `${count.toLocaleString()} Linhas selecionadas`
    : `${count.toLocaleString()} Linha selecionada`,

// Total rows footer text
footerTotalRows: 'Total de Linhas:',

// Total visible rows footer text
footerTotalVisibleRows: (visibleCount, totalCount) =>
  `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,

// Checkbox selection text
checkboxSelectionHeaderName: 'Checkbox Seleção',

// Boolean cell text
booleanCellTrueLabel: 'Verdadeiro',
booleanCellFalseLabel: 'Falso',

// Actions cell more text
actionsCellMore: 'mais',

// Column pinning text
pinToLeft: 'Fixar à esquerda',
pinToRight: 'Fixar à direita',
unpin: 'Desafixar',

// Tree Data
treeDataGroupingHeaderName: 'Grupo',
treeDataExpand: 'ver filhos',
treeDataCollapse: 'ocultar filhos',

// Used core components translation keys
MuiTablePagination: {},

}