import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from '@react-pdf/renderer';

import Logo1 from '../assets/images/1.jpg';
import Logo2 from '../assets/images/2.jpg';
import Logo3 from '../assets/images/3.jpg';
import Balucuc from '../assets/images/balucuc.jpg';
import Calantipe from '../assets/images/calantipe.jpg';
import Cansinala from '../assets/images/cansinala.jpg';
import Capalangan from '../assets/images/capalangan.jpg';
import Colgante from '../assets/images/colgante.png';
import Paligui from '../assets/images/paligui.jpg';
import Sampaloc from '../assets/images/sampaloc.jpg';
import San_Juan from '../assets/images/sanjuan.jpg';
import San_Vicente from '../assets/images/sanvicente.jpg';
import Sucad from '../assets/images/sucad.png';
import Sulipan from '../assets/images/sulipan.jpg';
import Tabuyuc from '../assets/images/tabuyuc.jpg';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 12,
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

const getLogo = (obj: any) => {
  console.log('logo :>> ', obj);
  let logos = {};

  const brgyLogos = {
    Balucuc,
    Calantipe,
    Cansinala,
    Capalangan,
    Colgante,
    Paligui,
    Sampaloc,
    'San Juan': San_Juan,
    'San Vicente': San_Vicente,
    Sucad,
    Sulipan,
    Tabuyuc
  };

  logos.left = obj.unit == "1"
    ? Logo1
    : obj.unit == "2"
    ? Logo2
    : Logo3;

  logos.right = obj.barangay
  ? brgyLogos[obj.barangay]
  : (obj.unit == "1"
    ? San_Juan
    : obj.unit == "2"
    ? Tabuyuc
    : San_Vicente)

  console.log('logos :>> ', logos);

  return logos;
}


const RequestsPDF = ({ data, user, header }: any) => {
  const hasBarangay = !user?.role.includes('Barangay');
  const columnWidths = getColumnWidths(hasBarangay);

  return (
    <Document>
      <Page style={styles.page} size='A4'  orientation='landscape'>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          {/* Left Logo */}
          <Image src={getLogo(header).left} style={styles.logo} />

          {/* Centered Header Content */}
          <View style={styles.headerContent}>
            <Text style={styles.headerText1}>{header?.h1 || ''}</Text>
            <Text style={styles.headerText2}>{header?.h2 || ''}</Text>
            <Text style={styles.headerText2}>{header?.h3 || ''}</Text>
             {/* Title */}
          </View>
          {/* Right Logo */}
          <Image src={getLogo(header).right} style={styles.logo} />
        </View>



        <View style={styles.table}>
        <Text style={styles.header}>{header?.title || ''}</Text>

          {/* Table Header */}
          <View style={styles.tableRow}>
            {hasBarangay && (
              <View style={[styles.tableColHeader, { width: columnWidths.barangay }]}>
                <Text style={styles.tableCellHeader}>Barangay</Text>
              </View>
            )}
            <View style={[styles.tableColHeader, { width: columnWidths.itemName }]}>
              <Text style={styles.tableCellHeader}>Item Name</Text>
            </View>
            <View style={[styles.tableColHeader, { width: columnWidths.quantity }]}>
              <Text style={styles.tableCellHeader}>Quantity</Text>
            </View>
            <View style={[styles.tableColHeader, { width: columnWidths.status }]}>
              <Text style={styles.tableCellHeader}>Status</Text>
            </View>
            <View style={[styles.tableColHeader, { width: columnWidths.reason }]}>
              <Text style={styles.tableCellHeader}>Reason</Text>
            </View>
          </View>
          {/* Table Body */}
          {data.map((itemData: any, index: any) => (
            <View style={styles.tableRow} key={index}>
              {hasBarangay && (
                <View style={[styles.tableCol, { width: columnWidths.barangay }]}>
                  <Text style={styles.tableCell}>{itemData.barangay}</Text>
                </View>
              )}
              <View style={[styles.tableColLeft, { width: columnWidths.itemName }]}>
                <Text style={styles.tableCell}>
                  {`${itemData.item.medicineBrandName || itemData.item.vitaminBrandName || itemData.item.vaccineName}`}
                  {itemData.item.type.toLowerCase() !== 'vaccine' && (
                    ` (${itemData.item.medicineGenericName || itemData.item.vitaminGenericName})`
                  )}
                </Text>
              </View>
              <View style={[styles.tableCol, { width: columnWidths.quantity }]}>
                <Text style={styles.tableCell}>{itemData.requestedQuantity}</Text>
              </View>
              <View style={[styles.tableCol, { width: columnWidths.status }]}>
                <Text style={styles.tableCell}>{itemData.status.replace('_', ' ').toUpperCase()}</Text>
              </View>
              <View style={[styles.tableColLeft, { width: columnWidths.reason }]}>
                <Text style={styles.tableCell}>{itemData.reason || 'N/A'}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default RequestsPDF;
