import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from '@react-pdf/renderer';

import Logo1 from '../assets/images/2.jpg';
import Logo2 from '../assets/images/balucuc.jpg';
import { capitalizeAndFormatLabel, formatDate, getTypes } from '../assets/common/constants';
import { useEffect } from 'react';
// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 10,
  },
  section: {
    marginBottom: 10,
  },
  fieldContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 130
  },
  fieldLabel: {
    width: '35%',
    fontWeight: 'bold',
  },
  fieldValue: {
    width: '65%',
  },
  header: {
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '70%',
    marginHorizontal: 'auto',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  headerText1:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 2,
  },
  headerText2: {
    fontSize: 12,
    textAlign: 'center',
    margin: 2,
  },
  logo: {
    width:70,
    heigh:70,
  },
  table: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#e4e4e4',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableColLeft: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  tableCellHeader: {
    fontWeight: 'bold',
  },
  tableCell: {},
});

// Helper function to get column widths
const getColumnWidths = (hasBarangay: boolean) => {
  if (hasBarangay) {
    return {
      barangay: '10%',
      itemName: '40%',
      quantity: '15%',
      status: '15%',
      reason: '20%',
    };
  } else {
    return {
      itemName: '40%',
      quantity: '20%',
      status: '20%',
      reason: '20%',
    };
  }
};


const RequestSinglePDF = ({ data, user, header }: any) => {

  const d = {
    barangay: data.barangay,
    itemName: `${data.item[`${getTypes(data.item)}BrandName`]} (${data.item[`${getTypes(data.item)}GenericName`]})`,
    quantity: data.requestedQuantity,
    status: data.status,
    reason: data.reason,
    created_at: data.created_at.toDate()
  };

  const renderFields = () => {

    return Object.keys(d).map((key) => (
      <View style={styles.fieldContainer} key={key}>
        <Text style={styles.fieldLabel}>
          {capitalizeAndFormatLabel(key)}:
        </Text>
        <Text style={styles.fieldValue}>
          {key.includes('created_at') || key.includes('updated_at')
            ? formatDate(data[key] as string)
            : d[key]}
        </Text>
      </View>)
    );
  };

  

  useEffect(() => {
    console.log('d :>> ', d);
  }, [data])

  return (
    <Document>
      <Page style={styles.page} size='A4'  orientation='landscape'>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          {/* Left Logo */}
          <Image src={Logo1} style={styles.logo} />

          {/* Centered Header Content */}
          <View style={styles.headerContent}>
            <Text style={styles.headerText1}>{header?.h1 || ''}</Text>
            <Text style={styles.headerText2}>{header?.h2 || ''}</Text>
            <Text style={styles.headerText2}>{header?.h3 || ''}</Text>
             {/* Title */}
          </View>
          {/* Right Logo */}
          <Image src={Logo2} style={styles.logo} />
        </View>

        <Text style={styles.header}>req-{data.id}</Text>
        <View style={styles.divider} />
        <Text style={styles.header}>Stock Request</Text>
        <View style={styles.section}>
          {renderFields()}
        </View>
        <View style={styles.divider} />
        
      </Page>
    </Document>
  );
};

export default RequestSinglePDF;
