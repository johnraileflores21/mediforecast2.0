import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from '@react-pdf/renderer';

import { capitalizeAndFormatLabel, formatDate, getTypes } from '../assets/common/constants';
import { useEffect } from 'react';

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
          {capitalizeAndFormatLabel(key == 'created_at' ? 'requested_date' : key)}:
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
    console.log('header :>> ', header);
  }, [data])

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

        <View style={styles.divider} />
        <Text style={styles.header}>Stock Request</Text>
        <Text style={styles.header}>{data.id.slice(0, 15)}</Text>
        <View style={styles.section}>
          {renderFields()}
        </View>
        <View style={styles.divider} />
        
      </Page>
    </Document>
  );
};

export default RequestSinglePDF;
